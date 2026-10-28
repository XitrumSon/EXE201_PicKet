import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:picket_api/src/api_config.dart';
import 'package:picket_api/src/supabase_gateway.dart';

/// Privileged operations are invoked only after the caller-scoped database
/// authorization and MFA check has succeeded. Secrets never leave this class.
class AdminService {
  AdminService(
    this.config, {
    http.Client? client,
    Map<String, String>? environment,
  }) : _client = client ?? http.Client(),
       _environment = environment ?? Platform.environment;
  final ApiConfig config;
  final http.Client _client;
  final Map<String, String> _environment;
  Map<String, String> get _headers {
    final key = _environment['SUPABASE_SECRET_KEY'] ?? '';
    var privileged = key.startsWith('sb_secret_') && key.length > 20;
    if (!privileged) {
      try {
        final parts = key.split('.');
        privileged =
            parts.length == 3 &&
            (jsonDecode(
                      utf8.decode(
                        base64Url.decode(base64Url.normalize(parts[1])),
                      ),
                    )
                    as Map)['role'] ==
                'service_role';
      } on Object {
        privileged = false;
      }
    }
    if (!privileged) {
      throw const ApiConfigException(
        'Administrative service is not configured.',
      );
    }
    return {
      'apikey': key,
      if (!key.startsWith('sb_secret_')) 'authorization': 'Bearer $key',
      'content-type': 'application/json',
    };
  }

  Future<void> rpc(String name, Map<String, dynamic> body) async {
    if (!{
      'admin_finish_auth',
      'collect_app_event',
      'admin_ingest',
      'admin_record_diagnostic',
    }.contains(name)) {
      throw const FormatException('Invalid service operation.');
    }
    final response = await _client
        .post(
          config.supabaseUrl.resolve('/rest/v1/rpc/$name'),
          headers: _headers,
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 20));
    if (response.statusCode >= 300) {
      throw const GatewayException(
        502,
        'Administrative service request failed.',
      );
    }
  }

  Future<void> userAction(String action, String userId, String email) async {
    http.Response response;
    if (action == 'suspend' || action == 'restore') {
      response = await _client
          .put(
            config.supabaseUrl.resolve('/auth/v1/admin/users/$userId'),
            headers: _headers,
            body: jsonEncode({
              'ban_duration': action == 'suspend' ? '876000h' : 'none',
            }),
          )
          .timeout(const Duration(seconds: 20));
    } else if (action == 'reset_password') {
      response = await _client
          .post(
            config.supabaseUrl
                .resolve('/auth/v1/recover')
                .replace(
                  queryParameters: {
                    'redirect_to':
                        'https://app.picketfinance.com/auth/reset-password',
                  },
                ),
            headers: _headers,
            body: jsonEncode({'email': email}),
          )
          .timeout(const Duration(seconds: 20));
    } else {
      throw const FormatException('Invalid account action.');
    }
    if (response.statusCode >= 300) {
      throw const GatewayException(502, 'Unable to complete account action.');
    }
  }

  void close() => _client.close();
}
