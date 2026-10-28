import csv
import io
import unittest
from metrics import parse_play_installs, apk_log_metric


class MetricsTests(unittest.TestCase):
    def csv(self, rows):
        stream = io.StringIO()
        writer = csv.DictWriter(stream, fieldnames=['Date', 'Package Name', 'Country', 'Daily Device Installs'])
        writer.writeheader()
        writer.writerows(rows)
        return stream.getvalue().encode('utf-16')

    def test_utf16_and_country_dimension(self):
        data = self.csv([{'Date': '2026-10-01', 'Package Name': 'com.picket.mobile', 'Country': 'VN', 'Daily Device Installs': '3'}])
        rows = parse_play_installs(data, '2026-10-01')
        self.assertEqual(rows[0]['value'], 3)
        self.assertEqual(rows[0]['dimension'], 'VN')

    def test_invalid_packages_dates_and_values_fail_without_partial_import(self):
        for patch in [{'Package Name': 'other.app'}, {'Date': '2026-09-01'}, {'Daily Device Installs': '-1'}, {'Daily Device Installs': '1.2'}, {'Country': 'VN,personal@example.com'}]:
            row = {'Date': '2026-10-01', 'Package Name': 'com.picket.mobile', 'Country': 'VN', 'Daily Device Installs': '3'}
            row.update(patch)
            with self.assertRaises(ValueError):
                parse_play_installs(self.csv([row]), '2026-10-01')

    def test_duplicate_report_rows_rejected(self):
        row = {'Date': '2026-10-01', 'Package Name': 'com.picket.mobile', 'Country': 'VN', 'Daily Device Installs': '3'}
        with self.assertRaises(ValueError):
            parse_play_installs(self.csv([row, row]), '2026-10-01')

    def test_required_columns(self):
        with self.assertRaises(ValueError):
            parse_play_installs(b'Date,Package Name\n', '2026-10-01')

    def test_apk_requests_are_served_not_installs(self):
        base = {'ts': 1793102400, 'path': '/downloads/picket-1.0.9.apk', 'bot': 'false', 'request': {'method': 'GET'}, 'status': 200}
        self.assertEqual(apk_log_metric(base)['metric'], 'served_requests')
        self.assertIsNotNone(apk_log_metric({**base, 'status': 206}))
        for patch in [{'status': 404}, {'request': {'method': 'HEAD'}}, {'bot': 'true'}, {'path': '/privacy.html'}]:
            self.assertIsNone(apk_log_metric({**base, **patch}))


if __name__ == '__main__':
    unittest.main()

class SalesTests(unittest.TestCase):
    def report(self, amount='1000', status='Charged', currency='VND', day='2026-10-01'):
        import zipfile
        stream = io.StringIO()
        writer = csv.DictWriter(stream, fieldnames=['Package ID','Order Charged Date','Financial Status','Currency of Sale','Charged Amount'])
        writer.writeheader()
        writer.writerow({'Package ID':'com.picket.mobile','Order Charged Date':day,'Financial Status':status,'Currency of Sale':currency,'Charged Amount':amount})
        output = io.BytesIO()
        with zipfile.ZipFile(output, 'w') as archive:
            archive.writestr('sales.csv', stream.getvalue().encode())
        return output.getvalue()

    def test_sales_and_refunds_keep_currency(self):
        from metrics import parse_sales_zip
        rows = parse_sales_zip(self.report('12.50', currency='USD'), '2026-10-01')
        self.assertEqual(rows[0]['value'], '12.50')
        self.assertEqual(rows[0]['dimension'], 'USD')
        self.assertEqual(rows[0]['metric'], 'estimated_gross_sales')
        rows = parse_sales_zip(self.report('-500', status='Refund'), '2026-10-01')
        self.assertEqual(rows[0]['metric'], 'estimated_refunds')
        self.assertEqual(rows[0]['value'], '500')

    def test_bad_financial_rows_fail_atomically(self):
        from metrics import parse_sales_zip
        for fields in [{'amount':'NaN'}, {'amount':'-2'}, {'currency':'email@example.test'}, {'day':'2026-09-01'}, {'status':'Unknown'}]:
            with self.assertRaises(ValueError):
                parse_sales_zip(self.report(**fields), '2026-10-01')
