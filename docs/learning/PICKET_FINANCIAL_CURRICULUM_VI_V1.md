# Picket — Giáo trình tài chính tiếng Việt v1

Biên soạn và đối chiếu nguồn ngày 2026-10-23. **authored-not-independent-review**: chưa được người độc lập duyệt; chưa đủ điều kiện phát hành nội dung published.

12 bài / 6 chương, dành cho người lớn từ 18 tuổi. Nội dung và tình huống VND do Picket biên soạn mới, không sao chép giáo trình nguồn. Nguồn quốc tế chỉ dùng cho khái niệm, không áp dụng quyền hoặc luật nước ngoài cho Việt Nam. Không khẳng định nguồn đã duyệt hoặc chứng thực Picket.

JSON cùng tên là dữ liệu chuẩn của bản này. `correctIndex` bắt đầu từ 0; `reviewedAt` chỉ là ngày tác giả rà nguồn và số học, không phải ngày phê duyệt độc lập. `workedExample.arithmeticChecks` là dữ liệu kiểm tra số học, không thực thi biểu thức trong ứng dụng.

## Cửa kiểm duyệt trước phát hành

- Independent financial-content review
- Vietnamese editorial and accessibility review
- Vietnam-relevant legal/safety review for borrowing and digital safety
- Pilot comprehension and Android font/TalkBack/offline checks
- Approved English translation before claiming bilingual curriculum

Thời lượng 3–5 phút chỉ là mục tiêu UX của kế hoạch, chưa có đo thử. Số từ dưới đây đếm theo khoảng trắng tiếng Việt, không tương đương số từ vựng ngôn ngữ học. Không hứa hoàn thành bài trong thời lượng đó trước pilot.

## picket.vi.financial.v1.01 — Chương 01: Chuyển ví không phải chi thêm

**Năng lực:** cashflow.internal-transfer  
**Mục tiêu:** Phân biệt chuyển tiền giữa ví của mình với thu nhập và chi tiêu; nêu rõ phạm vi đang xem.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 397 đơn vị cách trắng trong thân bài

Một số dư có thể nằm ở nhiều nơi: tiền mặt, tài khoản ngân hàng hoặc ví điện tử. Chuyển tiền giữa những nơi bạn sở hữu làm thay đổi chỗ giữ tiền. Để biết mình đã tiêu bao nhiêu, hãy hỏi tiền có rời khỏi toàn bộ phạm vi đang theo dõi để thanh toán một khoản hay chưa. Tên nút chuyển khoản trong ứng dụng ngân hàng chưa đủ cho câu trả lời: chuyển cho cửa hàng là thanh toán, còn chuyển sang tài khoản khác của chính mình có thể là chuyển ví.

Ví dụ minh họa: Hòa có 600.000đ tiền mặt và 1.400.000đ trong ngân hàng. Hòa rút 200.000đ, không mất phí. Sau đó tiền mặt là 800.000đ, ngân hàng còn 1.200.000đ. Tổng trước và sau đều là 2.000.000đ. Nếu ghi lần rút này thành khoản chi rồi lại ghi các lần mua bằng tiền mặt, Hòa sẽ đếm chi tiêu hai lần. Nếu ngân hàng thu thêm 3.000đ phí rút tiền, chỉ 3.000đ phí là khoản chi trong ví dụ; 200.000đ vẫn chỉ đổi nơi giữ.

Phạm vi giúp giải thích điều tưởng như mâu thuẫn. Khi chỉ xem ngân hàng, đúng là có 200.000đ đi ra khỏi ví đó. Khi xem cả hai ví, số tiền này có một phía đi ra và một phía đi vào nên triệt tiêu nhau. Vì thế một báo cáo dòng tiền theo ví có thể khác báo cáo chi tiêu toàn bộ. Không cần chọn một báo cáo là sai; cần đọc nhãn và biết những ví nào đang được cộng. Ví ngoài phạm vi cũng cần được ghi chú rõ thay vì tự coi mọi khoản ra là mua sắm.

Trong Picket, hãy rà ví nguồn, ví đích, số tiền và phí trước khi xác nhận. Việc tạo mục tiêu tiết kiệm bằng nhãn cũng không tự làm tiền biến mất. Một giao dịch chuyển thực tế chỉ nên được ghi một lần theo hai phía liên kết. Nếu lỡ nhập thành thu và chi riêng, hãy kiểm tra trước khi sửa để không xóa khoản mua thật cùng ngày. Bạn có thể học hoàn toàn bằng số liệu minh họa; không cần rút hoặc chuyển tiền thật để chứng minh đã hiểu. Điều cần nhớ là cùng một số tiền có thể đổi vị trí mà tổng tiền không tăng hoặc giảm.

### Ví dụ và số học

600.000 + 1.400.000 = 2.000.000; sau chuyển: 800.000 + 1.200.000 = 2.000.000. Phí 3.000 nếu có làm tổng còn 1.997.000.

- `600000+1400000 = 2000000`
- `600000+200000 = 800000`
- `1400000-200000 = 1200000`
- `2000000-3000 = 1997000`

### Tình huống thực hành

**1. Rút 200.000đ không phí từ ngân hàng sang tiền mặt của mình. Chi tiêu toàn bộ tăng bao nhiêu?**

- A. 200.000đ — Đây là số tiền đổi chỗ, chưa phải mua hàng.
- B. 0đ — Đúng: tổng hai ví không giảm.
- C. 400.000đ — Cộng hai phía làm đếm cùng số tiền hai lần.
Đáp án: **B** (`correctIndex: 1`).

**2. Chỉ xem ví ngân hàng trong ví dụ, 200.000đ có phải tiền ra khỏi phạm vi đó?**

- A. Không, vì chuyển ví luôn bằng không — Quy tắc tổng bằng không chỉ áp dụng khi có đủ hai phía trong phạm vi.
- B. Có, nhưng chưa phải chi tiêu toàn bộ — Đúng: ví ngân hàng giảm, ví tiền mặt tăng.
- C. Là thu nhập mới — Ngân hàng giảm nên không có thu nhập mới.
Đáp án: **B** (`correctIndex: 1`).

**3. Rút 200.000đ và trả thêm phí 3.000đ. Khoản chi do thao tác này là?**

- A. 203.000đ — 203.000đ là tiền ra khỏi ngân hàng, gồm cả phần chuyển sang tiền mặt.
- B. 200.000đ — 200.000đ vẫn thuộc sở hữu của bạn.
- C. 3.000đ — Đúng: phí là phần rời tổng tài sản trong tình huống.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Xem một giao dịch chuyển ví có sẵn hoặc giải lại ví dụ, không chuyển tiền thật. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/01/financial-competence-framework-for-adults-in-the-european-union_614b8b97/510f133c-en.pdf)

## picket.vi.financial.v1.02 — Chương 01: Ghi đúng trước khi phân loại

**Năng lực:** cashflow.confirmed-records  
**Mục tiêu:** Kiểm tra số tiền và dấu thu/chi, tránh bản ghi trùng và phân biệt dữ liệu thiếu với chi bằng không.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 416 đơn vị cách trắng trong thân bài

Một danh sách giao dịch hữu ích cần phản ánh những gì thực sự xảy ra. Bắt đầu bằng ngày, số tiền, ví và loại thu hoặc chi. Danh mục giúp tìm lại và so sánh, nhưng một tên danh mục rất đẹp không sửa được số tiền bị nhập sai. Khi quét hóa đơn, hãy coi kết quả là bản nháp cần đối chiếu. Máy có thể đọc nhầm dấu chấm, dòng tổng hoặc tiền khách đưa. Ảnh phong cảnh không phải bằng chứng cho một giao dịch; không nên đoán số tiền từ ảnh đó.

Mai có ba khoản chi đã kiểm tra: ăn trưa 45.000đ, đi xe 25.000đ và mua vở 30.000đ. Tổng là 100.000đ. Mai lưu ảnh hóa đơn bữa trưa vào chính giao dịch đó; tổng vẫn là 100.000đ, không tăng thành 145.000đ. Nếu ứng dụng tải ảnh chậm, trạng thái ảnh đang xử lý khác với trạng thái giao dịch đã lưu. Khi quay lại, cần xem bản ghi nào đã có trước khi nhấn lưu thêm lần nữa. Một ảnh đính kèm và một khoản chi là hai loại thông tin, không phải hai khoản tiền.

Phân loại nên phục vụ câu hỏi của bạn. Vở dùng đi học có thể thuộc học tập; cùng món vở mua tặng người khác có thể thuộc quà tặng. Đừng chỉ dựa vào tên cửa hàng để kết luận mục đích. Có thể để khoản chưa rõ vào nhóm cần xem lại, rồi bổ sung sau khi nhớ được bối cảnh. Khi nhiều người trả chung, chỉ ghi phần của mình hoặc dùng quy tắc chia khoản nhất quán; tránh lúc ghi cả hóa đơn, lúc ghi phần cá nhân mà không ghi chú.

Cuối một khoảng thời gian, hãy so danh sách với số dư hoặc chứng từ bạn còn giữ. Nếu quên ghi hai ngày, hãy đánh dấu thiếu thông tin thay vì nói hai ngày đó chi bằng không. Một khoản chênh chưa giải thích không tự trở thành thu nhập. Có thể dừng ở mức biết rằng dữ liệu chưa đầy đủ, rồi rà thêm khi thuận tiện. Trong Picket, chỉ dùng khoản đã xác nhận cho bài học lấy dữ liệu thật; bạn có thể chọn ví dụ minh họa nếu không muốn sử dụng thông tin cá nhân. Mục tiêu của ghi chép là làm quyết định rõ hơn, không phải tạo một bảng hoàn hảo hay bắt bạn nhớ mọi chi tiết ngay từ đầu.

### Ví dụ và số học

45.000 + 25.000 + 30.000 = 100.000đ; ảnh bữa trưa đính kèm không tạo khoản chi 45.000đ thứ hai.

- `45000+25000+30000 = 100000`
- `100000+45000 = 145000`

### Tình huống thực hành

**1. Mai thêm ảnh vào giao dịch ăn trưa đã lưu. Tổng ba khoản nên là?**

- A. 100.000đ — Đúng: đính kèm không tạo thêm chi tiêu.
- B. 145.000đ — Bạn đã cộng trùng bữa trưa.
- C. 55.000đ — Bạn đã bỏ một khoản chi thực tế.
Đáp án: **A** (`correctIndex: 0`).

**2. Không có bản ghi vào thứ Ba vì quên nhập. Kết luận phù hợp?**

- A. Chắc chắn không chi — Thiếu bản ghi không chứng minh không phát sinh.
- B. Chưa biết có chi hay không — Đúng: cần giữ trạng thái chưa đủ dữ liệu.
- C. Dùng mức cao nhất của tháng làm số thật — Ước lượng không được biến thành giao dịch đã xảy ra.
Đáp án: **B** (`correctIndex: 1`).

**3. OCR đọc tổng 450.000đ nhưng hóa đơn ghi 45.000đ. Làm gì?**

- A. Giữ số máy đọc vì máy khách quan — OCR vẫn có thể nhận sai ký tự.
- B. Lưu cả hai số thành hai khoản — Một lần mua không tạo ra hai khoản chỉ vì hai cách đọc.
- C. Đối chiếu và sửa bản nháp trước khi xác nhận — Đúng: số trên bản nháp phải được kiểm tra.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Rà một giao dịch hoặc ví dụ về ngày, ví, số tiền và khả năng nhập trùng. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_spending_tracker_2018-11_ADA.pdf)

## picket.vi.financial.v1.03 — Chương 02: Nhu cầu và mong muốn cần bối cảnh

**Năng lực:** planning.contextual-priorities  
**Mục tiêu:** Giải thích một ưu tiên bằng hoàn cảnh, thời điểm và phương án thay thế, không phán xét từ tên món hàng.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 418 đơn vị cách trắng trong thân bài

Nhu cầu thường liên quan đến sinh hoạt, sức khỏe, học tập hoặc trách nhiệm bạn phải đáp ứng. Mong muốn thường có phần lựa chọn linh hoạt hơn. Ranh giới này phụ thuộc hoàn cảnh chứ không nằm cố định trong tên món hàng. Internet có thể phục vụ học trực tuyến hoặc chỉ một dịch vụ giải trí bổ sung. Một chuyến xe công nghệ có thể giúp người đang chấn thương đến nơi an toàn. Vì vậy bài học không gán nhãn con người tốt hay xấu từ khoản chi, cũng không yêu cầu cắt mọi niềm vui.

Hãy thử ba câu hỏi: nếu hoãn thì hậu quả gì, cần đáp ứng trước ngày nào, có cách khác phù hợp không? Phương án rẻ hơn chỉ là lựa chọn khi thực tế đáp ứng được nhu cầu. Đi bộ không luôn thay được phương tiện trong đêm mưa hoặc khi đường không an toàn. Mua gói rẻ hơn cũng không hữu ích nếu thiếu chức năng bạn cần cho công việc. Một khoản có thể gồm phần thiết yếu và phần nâng cấp; bạn được quyền giải thích cách tách thay vì phải chọn một nhãn cho toàn bộ.

Trong tình huống giả lập, Phương còn 1.500.000đ trước kỳ thu nhập. Phương dự kiến dành 900.000đ cho tiền ở và 400.000đ cho thực phẩm. Sau hai khoản, còn 200.000đ. Tai nghe mới giá 350.000đ sẽ vượt phần còn lại 150.000đ nếu không có thay đổi khác. Phép tính không nói Phương là người thiếu kỷ luật; nó cho thấy cần hoãn, đổi phương án hoặc xác nhận thêm nguồn tiền. Nếu tai nghe cũ hỏng và công việc cần dùng ngay, bối cảnh thay đổi nhưng phép tính vẫn phải được giải quyết.

Bạn có thể đặt một khoản linh hoạt cho sở thích theo khả năng riêng. Không có một tỷ lệ ngân sách duy nhất phù hợp mọi người. Người đang phải hỗ trợ gia đình hoặc có chi phí sức khỏe cao có thể có ít lựa chọn hơn; gọi đó là yếu kém không giúp tạo tiền. Trong Picket, nhãn ưu tiên chỉ hỗ trợ suy nghĩ, không khóa lưu giao dịch và không tự quyết định thay bạn. Khi chưa rõ hoàn cảnh, câu trả lời tốt là hỏi thêm. Hãy thử ghi một câu lý do ngắn cho lựa chọn của mình; bạn có thể thay đổi lý do khi trách nhiệm, sức khỏe hoặc thời điểm thay đổi.

### Ví dụ và số học

1.500.000 − 900.000 − 400.000 = 200.000đ; 350.000 − 200.000 = 150.000đ còn thiếu cho lựa chọn này.

- `1500000-900000-400000 = 200000`
- `350000-200000 = 150000`

### Tình huống thực hành

**1. Thấy giao dịch xe công nghệ, có đủ để kết luận đây là mong muốn không?**

- A. Có, xe công nghệ luôn không cần thiết — Nhãn cố định bỏ qua sức khỏe và hoàn cảnh.
- B. Không, cần biết bối cảnh và phương án an toàn — Đúng: cùng dịch vụ có mục đích khác nhau.
- C. Có, vì giá cao hơn xe buýt — Giá thấp không đảm bảo phương án thay thế phù hợp.
Đáp án: **B** (`correctIndex: 1`).

**2. Phương giữ nguyên hai khoản đã dự kiến. Mua tai nghe 350.000đ thì thiếu bao nhiêu?**

- A. 150.000đ — Đúng: giá 350.000đ trừ phần còn 200.000đ.
- B. 200.000đ — 200.000đ là phần còn trước mua.
- C. 350.000đ — Đã có 200.000đ, không thiếu toàn bộ giá.
Đáp án: **A** (`correctIndex: 0`).

**3. Tai nghe hỏng, cần cho công việc. Điều nào hợp lý nhất?**

- A. Nhãn nhu cầu tự tạo thêm tiền — Nhãn không thay đổi số dư.
- B. Bỏ qua mọi khoản tới hạn — Hậu quả của nghĩa vụ vẫn tồn tại.
- C. Đánh giá phương án đáp ứng công việc và tính lại phần thiếu — Đúng: bối cảnh và khả năng chi trả đều cần được xem.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Chọn một ví dụ hoặc khoản có sẵn, viết lý do có thể hoãn hay cần ưu tiên. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_prioritizing-bills_tool.pdf)

## picket.vi.financial.v1.04 — Chương 02: Lập kế hoạch theo ngày tiền về

**Năng lực:** planning.irregular-income  
**Mục tiêu:** Lập lịch thu chi có xét ngày đến hạn và tách khoản thu chưa chắc chắn.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 414 đơn vị cách trắng trong thân bài

Tổng thu nhập trong tháng không kể hết câu chuyện. Một khoản tiền đến sau ngày trả tiền nhà không giúp thanh toán đúng hạn vào hôm trước. Người làm tự do, bán hàng nhỏ hoặc nhận tiền hỗ trợ theo đợt có thể cần lập kế hoạch theo từng kỳ tiền về. Hãy bắt đầu từ số tiền hiện có, rồi thêm những khoản thu đã xác nhận ngày và số tiền. Các khoản mới được hứa hoặc phụ thuộc công việc chưa hoàn tất nên để riêng như giả định, không coi đã nằm trong ví.

Nam có 1.200.000đ đầu tuần. Ngày thứ tư phải trả 800.000đ tiền phòng, ngày thứ sáu dự kiến cần 300.000đ cho thực phẩm. Một khách hàng hứa trả 1.000.000đ vào chủ nhật nhưng chưa xác nhận. Trước khoản thu đó, Nam chỉ còn 100.000đ sau hai khoản chi. Nếu phát sinh thêm chi phí 200.000đ vào thứ bảy thì thiếu 100.000đ trong kịch bản không nhận thêm tiền. Đưa khoản hứa trả vào đầu tuần sẽ che mất khoảng thiếu này dù tổng cuối tuần trông có vẻ dư.

Ngân sách trong hoàn cảnh đó có thể gồm phần chắc chắn và phần tùy tiền thực nhận. Đừng tự chia thu nhập tốt nhất năm cho các tuần rồi coi tuần nào cũng có mức đó. Có thể nhìn nhiều kỳ để nhận ra biến động, nhưng số trung bình không phải lời bảo đảm. Khi tiền về ít hơn dự kiến, hãy rà các khoản linh hoạt và chủ động hỏi bên nhận thanh toán về lựa chọn có thật. Không tự coi việc dời hạn là đã được đồng ý; cũng không bỏ nhu cầu ăn uống hoặc sức khỏe chỉ để làm bảng cân đối đẹp.

Trong Picket, xem lịch các ngày trước kỳ thu nhập tiếp theo giúp bạn đặt hạn mức phù hợp hơn một nhãn tháng chung chung. Hóa đơn đã trả phải được đánh dấu và đối chiếu để không trừ lần nữa. Nếu cần sửa kế hoạch, sửa giả định của tương lai; giao dịch đã xảy ra vẫn giữ đúng ngày thực tế. Bạn không cần tiết lộ mức lương để học bài này: có thể dùng ví dụ của Nam. Kết quả tốt là biết ngày nào cần chú ý, khoản nào chắc chắn và câu hỏi nào phải xác minh, chứ không phải buộc thu nhập thất thường trở nên đều đặn trên màn hình.

### Ví dụ và số học

1.200.000 − 800.000 − 300.000 = 100.000đ; thêm chi 200.000đ trước tiền về tạo mức −100.000đ.

- `1200000-800000-300000 = 100000`
- `100000-200000 = -100000`

### Tình huống thực hành

**1. Khách chưa xác nhận trả 1.000.000đ chủ nhật. Nên biểu diễn thế nào?**

- A. Tiền mặt đã có từ thứ hai — Ngày và độ chắc chắn bị thay đổi sai.
- B. Khoản thu giả định, tách khỏi số dư thực — Đúng: có thể so kịch bản nhận và chưa nhận.
- C. Thu nhập chắc chắn mỗi tuần — Một lời hứa không chứng minh lịch lặp lại.
Đáp án: **B** (`correctIndex: 1`).

**2. Trước chủ nhật, Nam chi thêm 200.000đ sau hai nghĩa vụ. Số dư kịch bản là?**

- A. 900.000đ — Con số này giả định tiền khách đã về.
- B. 100.000đ — 100.000đ là trước chi bổ sung.
- C. Âm 100.000đ — Đúng: 100.000đ trừ 200.000đ.
Đáp án: **C** (`correctIndex: 2`).

**3. Tháng có tổng thu lớn hơn tổng chi nhưng vẫn hụt giữa tháng. Vì sao?**

- A. Ngày thu có thể sau ngày cần trả — Đúng: lịch dòng tiền quan trọng bên cạnh tổng kỳ.
- B. Phép cộng không áp dụng được cho tiền — Phép cộng vẫn đúng, cần thêm trục thời gian.
- C. Chỉ cần đổi danh mục là đủ tiền — Đổi nhãn không tạo tiền.
Đáp án: **A** (`correctIndex: 0`).

### Hành động tự chọn

Xem hoặc viết lịch ba khoản tới hạn và khoản thu tiếp theo bằng dữ liệu minh họa. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_cash_flow_budget_tool_2018-11_ADA.pdf)
- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_income_benefits_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.05 — Chương 03: Quỹ dự phòng khác khoản đã biết trước

**Năng lực:** resilience.emergency-vs-planned  
**Mục tiêu:** Phân biệt sự cố chưa dự kiến với chi phí theo lịch và chọn mục tiêu dự phòng phù hợp hoàn cảnh.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 428 đơn vị cách trắng trong thân bài

Tiền dự phòng giúp bạn có thêm lựa chọn khi gặp một việc bất ngờ. Ví dụ có thể là đồ dùng thiết yếu hỏng hoặc gián đoạn thu nhập. Tiền dành cho khoản biết trước, như học phí kỳ tới hay phí gia hạn hàng năm, có vai trò khác: đó là chuẩn bị theo lịch. Hai loại đều có ích. Phân biệt chúng giúp bạn không nghĩ rằng mình liên tục gặp sự cố khi thực ra một khoản thường niên chưa được đưa vào kế hoạch. Không cần phán xét khi phải dùng tiền đã dành; hãy nhìn điều gì thực sự xảy ra.

Dung có 2.000.000đ, gồm 1.200.000đ dành cho học phí và 800.000đ dự phòng. Học phí đến hạn là 1.200.000đ, trả xong Dung còn 800.000đ. Nếu ngay sau đó thiết bị học tập cần sửa bất ngờ 500.000đ, Dung còn 300.000đ. Việc trả học phí không phải một lần rút quỹ dự phòng theo cách phân chia này. Số tiền dự phòng cũng không phải số tiền có thêm ngoài 2.000.000đ; đó là một phần của tổng đang có. Gắn nhãn cùng một khoản vào hai quỹ không khiến nó phục vụ đồng thời hai lần thanh toán.

Mức dự phòng phù hợp phụ thuộc nhu cầu, người phụ thuộc, độ ổn định thu nhập và những hỗ trợ thực sự có thể tiếp cận. Một mục tiêu khởi đầu nhỏ có thể dễ thực hiện hơn một con số lớn khiến bạn bỏ cuộc. Bài này không yêu cầu mọi người giữ một số tháng giống nhau và không hứa rằng đạt một mức nào đó sẽ an toàn trước mọi biến cố. Nếu hiện chưa còn tiền sau nhu cầu cơ bản, hãy nhận diện giới hạn đó; không cần vay tiền chỉ để tạo số dư mang tên dự phòng.

Hãy cân nhắc nơi giữ tiền mà bạn hiểu phí, khả năng rút và mức độ tiếp cận khi cần, thay vì chạy theo một mức sinh lời được hứa. Không đưa toàn bộ tiền cần sớm vào lựa chọn mà bạn không hiểu hoặc không rút được đúng lúc. Trong Picket, bạn có thể xem nhãn mục tiêu và số dư riêng để tránh nhầm. Sau một lần dùng dự phòng, chỉ lập lại kế hoạch khi có điều kiện; không cần tự phạt bằng việc bỏ chi phí thiết yếu. Một bước học có thể chỉ là liệt kê khoản biết trước và việc bất ngờ, không yêu cầu gửi tiền hay mua sản phẩm tài chính.

### Ví dụ và số học

2.000.000 − 1.200.000 = 800.000đ; 800.000 − 500.000 = 300.000đ.

- `2000000-1200000 = 800000`
- `800000-500000 = 300000`

### Tình huống thực hành

**1. Học phí có lịch rõ kỳ tới nên được xem là gì trong bài?**

- A. Sự cố không thể dự kiến — Đã biết ngày và số tiền nên có thể lập kế hoạch.
- B. Khoản cần chuẩn bị theo lịch — Đúng: khác sự cố chưa dự kiến.
- C. Thu nhập mới — Đây là tiền phải trả, không phải thu.
Đáp án: **B** (`correctIndex: 1`).

**2. Dung trả học phí và sửa thiết bị như ví dụ. Còn bao nhiêu?**

- A. 300.000đ — Đúng: đã trừ đủ cả hai khoản thực tế.
- B. 800.000đ — Đây là số trước khi sửa thiết bị.
- C. 1.500.000đ — Đã bỏ qua học phí trong phép tính.
Đáp án: **A** (`correctIndex: 0`).

**3. Hiện không dư sau nhu cầu cơ bản. Lựa chọn nào phù hợp nhất?**

- A. Vay để đạt một nhãn quỹ đẹp — Vay làm phát sinh nghĩa vụ, không tự tạo an toàn.
- B. Coi mình thất bại — Thiếu nguồn lực không phải đánh giá phẩm chất.
- C. Ghi nhận giới hạn và xem lại mục tiêu khi điều kiện đổi — Đúng: mục tiêu cần phù hợp hoàn cảnh thực tế.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Tách hai ví dụ thành khoản có lịch và sự cố bất ngờ; chưa cần chuyển tiền. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/)

## picket.vi.financial.v1.06 — Chương 03: Chia mục tiêu thành bước có thể đổi

**Năng lực:** saving.realistic-goal  
**Mục tiêu:** Tính phần còn thiếu và mức dành theo kỳ, biết điều chỉnh thời hạn khi hoàn cảnh đổi.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 422 đơn vị cách trắng trong thân bài

Một mục tiêu rõ thường có số tiền, lý do và thời điểm bạn muốn đạt. Nó vẫn là kế hoạch có thể sửa. Nếu giá thay đổi hoặc thu nhập giảm, điều chỉnh thời hạn không xóa đi những bước đã làm. Trước khi tính, hãy kiểm tra đã có bao nhiêu tiền thực sự dành cho mục tiêu này. Một khoản đã để cho tiền nhà không nên đồng thời được tính là tiền mua máy tính, trừ khi bạn chủ động đổi phân bổ và hiểu hậu quả cho tiền nhà.

Tú muốn dành 3.000.000đ cho một khóa học sau sáu kỳ thu nhập. Tú đã có 600.000đ cho mục tiêu đó. Còn thiếu 2.400.000đ; nếu chia đều sáu kỳ thì mỗi kỳ là 400.000đ. Đây là phép chia để hiểu nhịp độ, không phải mệnh lệnh phải dành đủ bất kể hoàn cảnh. Nếu thực tế chỉ có thể dành 300.000đ mỗi kỳ, tám kỳ mới đủ phần còn thiếu theo giả định giá không đổi và không có lãi. Không cần tự thêm lợi nhuận tương lai chưa chắc chắn để làm thời hạn trông đạt được.

Khi một kỳ phải ưu tiên nhu cầu khác, hãy tính lại trên số thực có, tránh vừa cộng khoản dự định vừa cộng khoản đã chuyển. Tiền vào ví tiết kiệm của chính mình vẫn là chuyển ví ở phạm vi tổng; mục tiêu thể hiện bạn muốn dùng tiền vào việc gì. Nếu chỉ cập nhật thanh tiến độ mà không có tiền tương ứng, cần ghi rõ đó là ghi nhận kế hoạch hay điều chỉnh dữ liệu. Một thanh đầy không chứng minh bạn đủ tiền thanh toán khi các khoản khác cùng cần đến số dư đó.

Trong Picket, có thể chọn thực hành xem lại mục tiêu có sẵn hoặc chỉ giải ví dụ. Không cần mở một khoản tiết kiệm thật để hoàn thành bài, không cần chứng minh bằng ảnh tài khoản. Một lời nhắc tự chọn có thể giúp bạn quay lại kế hoạch, nhưng bỏ qua không làm mất kiến thức đã học. Khi so hai phương án, hãy ghi rõ điều đang đổi: thời gian, số tiền mỗi kỳ hoặc phạm vi mục tiêu. Tránh kết luận rằng ai hoàn thành nhanh hơn là quản lý tiền giỏi hơn; nguồn lực và trách nhiệm của mỗi người khác nhau. Bước nhỏ có ích khi bạn hiểu được nó và vẫn đáp ứng các nhu cầu quan trọng hiện tại.

### Ví dụ và số học

(3.000.000 − 600.000) / 6 = 400.000đ/kỳ; 2.400.000 / 300.000 = 8 kỳ.

- `3000000-600000 = 2400000`
- `2400000/6 = 400000`
- `2400000/300000 = 8`

### Tình huống thực hành

**1. Tú đã có 600.000đ, mục tiêu 3.000.000đ. Còn thiếu?**

- A. 3.600.000đ — Đã cộng thay vì trừ phần có sẵn.
- B. 2.400.000đ — Đúng: mục tiêu trừ tiền thực đã dành.
- C. 600.000đ — Đây là số có, không phải phần thiếu.
Đáp án: **B** (`correctIndex: 1`).

**2. Chỉ dành được 300.000đ mỗi kỳ cho phần thiếu. Cần mấy kỳ theo giả định bài?**

- A. 6 — Sáu kỳ chỉ tạo 1.800.000đ.
- B. 10 — Mười kỳ là chia toàn bộ mục tiêu, bỏ qua 600.000đ đã có.
- C. 8 — Đúng: 2.400.000 chia 300.000 bằng tám.
Đáp án: **C** (`correctIndex: 2`).

**3. Một kỳ cần dùng tiền cho thuốc. Nên làm gì với mục tiêu?**

- A. Cập nhật số thực và tính lại thời hạn — Đúng: kế hoạch phục vụ hoàn cảnh, không ngược lại.
- B. Giữ tiến độ giả cho đẹp — Tiến độ không khớp tiền làm quyết định sau khó hơn.
- C. Bỏ thuốc để không đứt tiến độ — Nhu cầu sức khỏe không nên bị thay thế bằng điểm tiến độ.
Đáp án: **A** (`correctIndex: 0`).

### Hành động tự chọn

Viết một mục tiêu giả lập với số đã có, phần thiếu và hai lựa chọn thời hạn. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_savings_plan_tool_2018-11_ADA.pdf)
- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_SMART-goals_tool_2018-11.pdf)

## picket.vi.financial.v1.07 — Chương 04: Số dư chưa phải tiền có thể dành ra

**Năng lực:** forecast.obligations-and-scope  
**Mục tiêu:** Tách số dư hiện tại, nghĩa vụ tương lai và mức dự phòng khi xem một kịch bản.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 419 đơn vị cách trắng trong thân bài

Số dư trả lời bạn đang có bao nhiêu tiền trong phạm vi được xem. Nó không tự trả lời bao nhiêu tiền có thể dành cho một quyết định mới. Có những khoản chưa trừ khỏi ví nhưng sắp cần thanh toán. Bạn cũng có thể muốn giữ một phần để xử lý bất ngờ. Khi đọc một con số, hãy tìm mốc thời gian, những ví được tính và các khoản đã hoặc chưa nằm trong đó. Nếu một ví ngoại tệ chưa có tỷ giá phù hợp, đừng cộng thẳng số của nó với số VND.

Vy có 4.000.000đ trong các ví VND đang xem. Trước kỳ thu tiếp theo, Vy đã xác nhận tiền phòng 1.500.000đ và chi thực phẩm dự kiến 700.000đ. Vy muốn giữ 500.000đ làm khoảng dự phòng. Theo đúng các đầu vào đó, phần còn sau nghĩa vụ và phần dành lại là 1.300.000đ. Phép tính không nói số dư ngân hàng hiện đã giảm xuống 1.300.000đ. Nó phân biệt tiền hiện có với phần đang được cân nhắc cho quyết định mới. Khoản dự phòng là phân bổ của cùng số dư, không phải một khoản chi đã thực hiện.

Nếu tiền phòng đã trả và giao dịch đó đã trừ vào số dư 4.000.000đ, bạn không nên trừ nó lần nữa. Cần đối chiếu trạng thái hóa đơn và bản ghi thanh toán trước khi xem lịch. Tương tự, ảnh hóa đơn chưa xác nhận không được tự tạo một nghĩa vụ mới ngoài khoản đã ghi. Chuyển giữa hai ví trong phạm vi không tăng tổng tiền để dành. Các quy tắc này giúp tránh một báo cáo quá lạc quan hoặc quá bi quan vì đếm cùng khoản nhiều lần.

Con số 1.300.000đ vẫn phụ thuộc vào danh sách đã đủ chưa. Vy có thể quên chi phí đi lại hoặc có một khoản thu chưa chắc chắn. Hãy xem kết quả như một câu trả lời có điều kiện, kèm điều cần kiểm tra thêm. Trong Picket, khi chưa xác nhận lịch, tốt hơn là nói chưa đủ dữ liệu thay vì khẳng định bạn được phép tiêu một mức cụ thể. Bạn có thể tự chọn thay đổi giả định và xem kết quả, nhưng ứng dụng không quyết định thay bạn. Thực hành của bài là rà một nghĩa vụ và hỏi nó đã trả hay chưa; không cần cung cấp thông tin tài khoản ngân hàng cho bất kỳ dịch vụ mới nào.

### Ví dụ và số học

4.000.000 − 1.500.000 − 700.000 − 500.000 = 1.300.000đ theo đầu vào đã nêu.

- `4000000-1500000-700000-500000 = 1300000`

### Tình huống thực hành

**1. 1.300.000đ trong ví dụ có ý nghĩa gì?**

- A. Số dư ngân hàng chắc chắn ngay lúc này — Ngân hàng chưa tự trừ các khoản tương lai và phân bổ dự phòng.
- B. Phần còn có điều kiện sau các khoản đã nêu — Đúng: cần giữ nguyên giả định và phạm vi để đọc số.
- C. Tiền ứng dụng vừa tạo thêm — Tính toán không tạo thêm tiền.
Đáp án: **B** (`correctIndex: 1`).

**2. Tiền phòng đã nằm trong giao dịch trừ số dư hiện tại. Trừ thêm hóa đơn đó gây gì?**

- A. Đếm nghĩa vụ hai lần — Đúng: cần đối chiếu trạng thái thanh toán.
- B. Tăng độ chính xác — Trừ trùng làm dự kiến thấp sai.
- C. Tạo thu nhập mới — Không có nguồn thu mới nào.
Đáp án: **A** (`correctIndex: 0`).

**3. Có ví 100 USD và ví 4.000.000 VND nhưng chưa có tỷ giá. Nên?**

- A. Cộng thành 4.000.100 VND — Khác đơn vị nên không cộng trực tiếp.
- B. Coi USD bằng không mà không báo — Bỏ âm thầm làm người dùng hiểu sai phạm vi.
- C. Hiển thị riêng và nói rõ chưa tổng hợp chéo tiền tệ — Đúng: giới hạn phải hiện rõ.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Rà một khoản tới hạn hoặc ví dụ để đánh dấu đã trả/chưa trả, không tạo thanh toán thật. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_bill_calendar_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.08 — Chương 04: Kịch bản giúp hỏi, không đoán chắc tương lai

**Năng lực:** forecast.scenario-and-coverage  
**Mục tiêu:** So hai kịch bản cùng giả định và giải thích vì sao thiếu dữ liệu không cho phép khẳng định dự báo.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 419 đơn vị cách trắng trong thân bài

Một kịch bản trả lời câu hỏi nếu những điều này xảy ra thì số tiền sẽ thay đổi thế nào. Dự báo cố gắng ước lượng điều có thể xảy ra từ dữ liệu và phương pháp cụ thể. Cả hai đều có giới hạn, nhưng không nên dùng hai tên thay nhau để tạo cảm giác chắc chắn. Khi bạn nhập giá một món định mua rồi xem chênh lệch, đó trước hết là phép tính có điều kiện. Nó không chứng minh người dùng sẽ thật sự mua, cũng không chứng minh mọi khoản thu chi khác đã được biết.

An có 2.000.000đ. Trong bảy ngày, An xác nhận một khoản thu 1.000.000đ và nghĩa vụ 1.500.000đ. Nếu không có khoản nào khác, cuối kỳ còn 1.500.000đ. Nếu mua món đồ 600.000đ trong kỳ với các điều kiện giữ nguyên, còn 900.000đ. Chênh lệch giữa hai phương án là 600.000đ. Đây không phải khẳng định An sẽ có chính xác 900.000đ tuần tới. Nếu khoản thu đến chậm hoặc còn chi chưa nhập, kết quả thực tế khác; cần xem thêm số dư theo từng ngày chứ không chỉ ngày cuối.

Dữ liệu thưa dễ làm câu chuyện sai. Không ghi giao dịch vào ba ngày không có nghĩa là ba ngày đều chi bằng không. Nếu chỉ theo dõi một ví, báo cáo cũng không biết mọi khoản ở ví khác. Một mô hình phức tạp không tự lấp được khoảng trống này bằng sự thật. Cách hữu ích là hỏi mức độ ghi đủ, nêu mốc đồng bộ và cho phép bạn sửa lịch đã biết. Các khoảng thấp và cao do đổi giả định chỉ là các kịch bản; không gọi là xác suất tin cậy đã kiểm chứng nếu chưa đo và hiệu chuẩn trên dữ liệu phù hợp.

Trong Picket, thử một lựa chọn không nên tự tạo giao dịch hoặc sửa ngân sách thật. Chỉ khi bạn chủ động xác nhận một sự việc đã xảy ra mới dùng luồng ghi chép tương ứng. Khi thiếu lịch sử, bài vẫn dùng số minh họa để giải thích công thức mà không bịa một ngày hết tiền. Bạn có thể chọn chưa kết luận và bổ sung đầu vào sau. Thực hành tốt là nói được câu điều kiện trước con số: nếu lịch đúng và không còn khoản nào khác, kết quả là bao nhiêu. Câu đó giúp bạn kiểm tra quyết định và nhìn ra điều còn chưa biết.

### Ví dụ và số học

Không mua: 2.000.000 + 1.000.000 − 1.500.000 = 1.500.000đ. Mua: 1.500.000 − 600.000 = 900.000đ.

- `2000000+1000000-1500000 = 1500000`
- `1500000-600000 = 900000`
- `1500000-900000 = 600000`

### Tình huống thực hành

**1. So hai phương án chỉ khác giá món đồ 600.000đ. Chênh lệch cuối kỳ?**

- A. 600.000đ — Đúng: các giả định khác giữ nguyên.
- B. 900.000đ — Đây là số còn của phương án mua.
- C. 1.500.000đ — Đây là số còn của phương án không mua.
Đáp án: **A** (`correctIndex: 0`).

**2. Ba ngày không ghi dữ liệu. Có thể kết luận chi tiêu bằng không?**

- A. Có vì biểu đồ trống — Biểu đồ trống có thể do chưa nhập.
- B. Chưa thể kết luận — Đúng: cần biết độ phủ ghi chép.
- C. Có nếu AI trả lời tự tin — Độ tự tin của lời văn không thay bằng chứng.
Đáp án: **B** (`correctIndex: 1`).

**3. Thử giá trên màn hình kịch bản nên làm gì với giao dịch thật?**

- A. Tạo khoản chi tự động — Thử phương án chưa phải mua thật.
- B. Sửa ngân sách để vừa kết quả — Điều chỉnh âm thầm làm mất ý nghĩa kế hoạch.
- C. Giữ nguyên, chỉ mô phỏng cho tới thao tác xác nhận riêng — Đúng: thử nghiệm và ghi nhận thực tế là hai bước khác nhau.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Giải hai kịch bản minh họa và viết một điều có thể khiến kết quả khác. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfbp_your-money-your-goals_adjust_cash_flow_tool_2018-11_ADA.pdf)
- [Nguồn tham khảo](https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/01/financial-competence-framework-for-adults-in-the-european-union_614b8b97/510f133c-en.pdf)

## picket.vi.financial.v1.09 — Chương 05: Nhìn tổng chi phí trước khoản trả nhỏ

**Năng lực:** borrowing.total-cost  
**Mục tiêu:** Tính tổng phải trả từ lịch và phí; phân biệt lãi suất quảng cáo với toàn bộ chi phí của ví dụ.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 410 đơn vị cách trắng trong thân bài

Một khoản vay không chỉ có tiền gốc. Bạn cần biết số tiền thực nhận, lịch trả, tổng lãi và các loại phí có thể phát sinh. Một mức trả từng kỳ nhỏ không tự chứng minh khoản vay rẻ hơn. Muốn so hai lựa chọn cần cùng hiểu số tiền được sử dụng, số kỳ, thời điểm và điều kiện. Nếu thông tin chưa đủ, câu trả lời đúng có thể là chưa so được, thay vì chọn mức phần trăm nhìn thấp nhất trên một dòng quảng cáo.

Trong hợp đồng giả lập A, Linh nhận 3.000.000đ và trả ba kỳ, mỗi kỳ 1.080.000đ. Có thêm phí 60.000đ trả riêng lúc bắt đầu. Tổng tiền trả là 3.300.000đ; phần vượt tiền nhận là 300.000đ. Hợp đồng giả lập B cũng cho nhận đủ 3.000.000đ, trả ba kỳ 1.110.000đ và không có phí khác: tổng 3.330.000đ. Theo đúng các điều kiện đã cho, A thấp hơn 30.000đ về tổng số tiền. Đây là so sánh số học, không phải giới thiệu bên cho vay hay kết luận tính hợp pháp của bất kỳ sản phẩm nào.

Đọc kỹ phí có được khấu trừ ngay khỏi tiền nhận hay trả riêng. Hai cách có thể làm số tiền thực dùng khác nhau dù cùng gọi là vay 3.000.000đ. Kiểm tra thêm phí trả chậm, điều kiện trả trước và khoản dịch vụ kèm theo. Đừng tự suy ra lãi suất năm từ phép chia đơn giản khi lịch trả và số dư gốc thay đổi theo kỳ. Cũng không nên gắn tên một chỉ số nước ngoài vào một phép tính chưa đúng định nghĩa. Trong bài này chúng ta chỉ tính tổng các khoản tiền đã được nêu rõ.

Trước quyết định thật, bạn cần thông tin hợp đồng áp dụng tại Việt Nam và có thể hỏi người có chuyên môn phù hợp nếu điều khoản khó hiểu. Nguồn quốc tế ở cuối bài hỗ trợ cách nhìn chi phí, không thay thế luật Việt Nam và không tạo quyền hay thời hạn pháp lý ở đây. Bạn không cần nhập khoản vay thật hoặc bấm đăng ký để hoàn thành. Trong Picket, hãy phân biệt dữ liệu mô phỏng với nghĩa vụ đã có; chỉ ghi lịch thật khi đã kiểm tra. Nếu bị thúc ép ký khi còn câu hỏi chưa được trả lời, việc dừng để xác minh giúp giữ quyền chủ động của bạn.

### Ví dụ và số học

A: 3 × 1.080.000 + 60.000 = 3.300.000đ, chi phí 300.000đ. B: 3 × 1.110.000 = 3.330.000đ; chênh 30.000đ.

- `3*1080000+60000 = 3300000`
- `3300000-3000000 = 300000`
- `3*1110000 = 3330000`
- `3330000-3300000 = 30000`

### Tình huống thực hành

**1. Tổng phải trả của A theo ví dụ?**

- A. 3.240.000đ — Đã bỏ phí trả riêng 60.000đ.
- B. 3.300.000đ — Đúng: cộng ba kỳ và phí.
- C. 3.060.000đ — Đã bỏ phần lớn các khoản trả theo kỳ.
Đáp án: **B** (`correctIndex: 1`).

**2. Chỉ biết lãi suất quảng cáo của hai hợp đồng. Đã chọn được rẻ hơn chưa?**

- A. Chưa, cần lịch, tiền thực nhận và phí — Đúng: một chỉ số chưa thể hiện toàn bộ tiền phải trả.
- B. Rồi, cứ chọn số nhỏ — Phí và cách tính có thể khác.
- C. Rồi, chọn bên hứa giải ngân nhanh — Tốc độ không cho biết chi phí.
Đáp án: **A** (`correctIndex: 0`).

**3. Nguồn CFPB nói về công bố TILA tại Mỹ. Áp dụng thế nào trong bài Việt Nam?**

- A. Coi đó là luật Việt Nam — Nguồn nước ngoài không trở thành luật Việt Nam.
- B. Hứa mọi hợp đồng Việt Nam cùng biểu mẫu — Chưa có bằng chứng cho kết luận đó.
- C. Chỉ tham khảo khái niệm chi phí, kiểm điều khoản và luật áp dụng riêng — Đúng: phân biệt khái niệm với yêu cầu pháp lý từng nơi.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

So hai bảng tiền giả lập; ghi một câu hỏi về phí còn thiếu, không đăng ký vay. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/)
- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_auto_loans_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.10 — Chương 05: Lịch trả quan trọng như tổng tiền

**Năng lực:** borrowing.repayment-timing  
**Mục tiêu:** Nhận ra thiếu hụt trước ngày thu nhập và kiểm tra điều kiện trước khi đổi lịch hoặc vay bù.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 413 đơn vị cách trắng trong thân bài

Sau khi hiểu tổng chi phí, hãy đặt từng khoản trả lên lịch cùng thu nhập và nhu cầu sinh hoạt. Một hợp đồng có tổng thấp hơn vẫn có thể gây áp lực nếu các kỳ trả không phù hợp ngày bạn có tiền. Điều này không tự khiến một lựa chọn khác tốt hơn; nó cho bạn thêm tiêu chí cần kiểm tra. Số dư cuối tháng dương không bảo đảm mọi ngày trong tháng đều đủ tiền. Đặc biệt với thu nhập theo dự án, ngày khách hứa trả và ngày tiền thực về có thể khác nhau.

Bình có 900.000đ đầu kỳ. Ngày mười phải trả một khoản theo hợp đồng 700.000đ. Trước ngày mười lăm, Bình cần 300.000đ cho nhu cầu thiết yếu. Thu nhập 1.200.000đ dự kiến về ngày mười lăm. Trước ngày thu, phép tính là 900.000 − 700.000 − 300.000 = âm 100.000đ. Đến khi tiền về đủ và không có khoản khác, còn 1.100.000đ. Chỉ nhìn số cuối kỳ sẽ bỏ qua thiếu hụt 100.000đ trước đó. Đổi ngày trên ứng dụng không tự đổi ngày đến hạn trong hợp đồng.

Nếu thấy khoảng thiếu, hãy xác minh ngày thu và hỏi bên liên quan về lựa chọn thực tế trước hạn. Mọi thay đổi lịch cần được xác nhận, gồm phí và ảnh hưởng của nó. Trả một khoản phí gia hạn không nhất thiết làm giảm tiền gốc; phải đọc cách ghi nhận của chính hợp đồng. Vay mới để bù kỳ cũ có thể thêm nghĩa vụ, nên cần nhìn lịch tổng của tất cả khoản chứ không chỉ một kỳ đang gấp. Bài học không chọn sản phẩm vay hoặc khuyên bỏ một khoản thiết yếu để trả bằng mọi giá.

Trong Picket, lịch nhắc chỉ giúp nhớ; dấu hoàn thành phải khớp một khoản thanh toán thật đã được xác nhận. Nếu số tiền đã nằm trong giao dịch, đừng nhập thêm lần nữa từ lời nhắc. Có thể dùng ghi chú cho điều chưa rõ và quay lại sau. Khi nhận cảnh báo, bạn được quyền xem công thức và phạm vi thay vì chấp nhận một câu kết luận tuyệt đối. Thực hành bài này chỉ yêu cầu đánh dấu một ngày thiếu trong ví dụ và nghĩ một câu hỏi cần xác minh. Không cần cung cấp số hợp đồng, giấy tờ cá nhân hay thực hiện khoản trả thật để học được cách đọc lịch.

### Ví dụ và số học

Trước thu: 900.000 − 700.000 − 300.000 = −100.000đ. Sau thu: −100.000 + 1.200.000 = 1.100.000đ.

- `900000-700000-300000 = -100000`
- `-100000+1200000 = 1100000`

### Tình huống thực hành

**1. Trước ngày mười lăm, Bình thiếu bao nhiêu theo ví dụ?**

- A. Không thiếu vì cuối kỳ dương — Tiền chưa về không trả được nhu cầu đến trước.
- B. 100.000đ — Đúng: đầu vào cho mức âm 100.000đ.
- C. 1.100.000đ — 1.100.000đ là số sau khoản thu.
Đáp án: **B** (`correctIndex: 1`).

**2. Bình sửa ngày nhắc trong Picket. Hạn hợp đồng có tự đổi không?**

- A. Có — Ứng dụng không sửa thỏa thuận với bên cho vay.
- B. Có nếu tắt thông báo — Tắt nhắc không đổi nghĩa vụ.
- C. Không, phải được bên liên quan xác nhận — Đúng: cần xác nhận thay đổi và điều kiện thực tế.
Đáp án: **C** (`correctIndex: 2`).

**3. Đóng phí gia hạn có chắc giảm tiền gốc không?**

- A. Không, cần đọc cách phân bổ trong hợp đồng — Đúng: phí và gốc có thể là hai khoản khác nhau.
- B. Chắc chắn giảm đủ bằng phí — Không có dữ kiện để khẳng định.
- C. Chắc chắn xóa nợ — Gia hạn không có nghĩa xóa nghĩa vụ.
Đáp án: **A** (`correctIndex: 0`).

### Hành động tự chọn

Đánh dấu khoảng thiếu trong lịch giả lập và viết câu hỏi về ngày trả hoặc phí. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_cash_flow_budget_tool_2018-11_ADA.pdf)
- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_income_benefits_tool_2018-11_ADA.pdf)
- [Nguồn tham khảo](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_auto_loans_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.11 — Chương 06: Dừng một nhịp trước yêu cầu OTP

**Năng lực:** safety.otp-and-phishing  
**Mục tiêu:** Nhận ra yêu cầu chuyển tiền hoặc chia sẻ bí mật đáng ngờ và xác minh qua kênh chính thức độc lập.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 428 đơn vị cách trắng trong thân bài

Một người biết tên hoặc chi tiết đơn hàng của bạn chưa chắc là người có quyền yêu cầu thao tác tài khoản. Kẻ giả mạo có thể dùng thông tin đúng để kể một câu chuyện gấp: phải xác minh ngay, nhận hoàn tiền hoặc tránh bị khóa. Khi câu chuyện thúc bạn bỏ bước kiểm tra, hãy dừng. Việc xuất hiện tên thương hiệu trên tin nhắn hay một logo quen không đủ để chứng minh kênh đó thật. Bài này tập trung vào cách xử lý yêu cầu, không yêu cầu bạn phân biệt mọi thủ thuật bằng mắt.

Ví dụ hoàn toàn giả lập: một người gọi nói hoàn 250.000đ cho Hà nhưng yêu cầu Hà chuyển trước 50.000đ và đọc mã OTP. Hà đang có 1.000.000đ. Nếu chuyển 50.000đ, số dư còn 950.000đ, chứ chưa thành 1.200.000đ vì khoản hoàn 250.000đ chỉ là lời hứa. Không có phép tính nào xác nhận người gọi đáng tin. Cách an toàn trong tình huống là ngừng thao tác, tự mở ứng dụng hoặc kênh chăm sóc chính thức mà Hà biết để kiểm tra. Không dùng ngay đường liên kết hay số gọi lại do người đó cung cấp.

Không gửi OTP, mật khẩu hay thông tin đăng nhập cho người gọi hoặc người nhắn tin. Mã xác thực chỉ nên được dùng trong thao tác do chính bạn chủ động thực hiện ở kênh chính thức đã kiểm tra, sau khi hiểu nội dung đang xác nhận. Không cài ứng dụng, cấp quyền điều khiển thiết bị hoặc quét mã lạ theo chỉ dẫn hoàn tiền. Nếu đã thao tác và nghi bị lừa, dừng giao dịch; liên hệ ngân hàng qua kênh chính thức để được hướng dẫn bảo vệ tài khoản, giữ bằng chứng và trình báo cơ quan Công an. Không bảo đảm tiền chắc chắn được lấy lại.

Trong Picket, bài thực hành dùng tình huống mô phỏng. Ứng dụng không cần OTP ngân hàng, ảnh thẻ hoặc mật khẩu để chấm câu trả lời. Không nhập một mã thật vào ô học tập và không gửi ảnh màn hình chứa bí mật. Khi nhận yêu cầu khẩn, có thể tự hỏi: ai khởi đầu liên hệ, tôi đang xác nhận điều gì, có thể xác minh độc lập bằng cách nào? Việc dừng để hỏi không phải lỗi của bạn. Nếu đã mắc bẫy, tập trung các bước bảo vệ và hỗ trợ; đừng để xấu hổ làm chậm việc báo cho đơn vị có khả năng xử lý.

### Ví dụ và số học

1.000.000 − 50.000 = 950.000đ; 250.000đ được hứa chưa phải thu nhập đã nhận. Giả định nhận và chuyển mới cho 1.200.000đ, không dùng để đánh giá độ tin cậy.

- `1000000-50000 = 950000`
- `1000000-50000+250000 = 1200000`

### Tình huống thực hành

**1. Người gọi biết đúng đơn hàng và đòi OTP để hoàn tiền. Nên?**

- A. Đọc mã vì họ biết thông tin — Biết thông tin không chứng minh danh tính và quyền truy cập.
- B. Dừng và xác minh bằng kênh chính thức độc lập — Đúng: không chia sẻ bí mật theo yêu cầu người gọi.
- C. Chỉ đọc nửa mã — Vẫn làm lộ thông tin, không tạo cách xác minh an toàn.
Đáp án: **B** (`correctIndex: 1`).

**2. Hà chuyển 50.000đ, khoản hoàn chưa về. Số dư từ 1.000.000đ còn?**

- A. 950.000đ — Đúng: chỉ ghi tiền thực đã ra.
- B. 1.200.000đ — Đã tính khoản hứa như tiền nhận thật.
- C. 1.250.000đ — Vừa cộng tiền chưa về vừa bỏ khoản đã chuyển.
Đáp án: **A** (`correctIndex: 0`).

**3. Đã bấm liên kết và nghi lộ thông tin. Phản ứng phù hợp?**

- A. Chờ vì báo sẽ xấu hổ — Chậm xử lý có thể làm tăng rủi ro.
- B. Chuyển thêm tiền để lấy lại — Lời hứa lấy lại tiền có thể tiếp tục là bẫy.
- C. Dừng, liên hệ ngân hàng chính thức, giữ bằng chứng và trình báo — Đúng: ưu tiên bảo vệ; không có bảo đảm thu hồi.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Đọc kịch bản và viết kênh xác minh độc lập; tuyệt đối không dùng OTP hoặc liên kết lạ thật. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://www.bocongan.gov.vn/bai-viet/xuat-hien-thu-doan-lua-dao-moi-khi-mua-hang-online-1790562304)
- [Nguồn tham khảo](https://vcc.gov.vn/default.aspx?category_id=9343771e-96be-48b5-a35d-b8ea9bc1aa93&do=detail&id=04a6bd22-786c-4d56-983c-923cce86ec7c&page=news)

## picket.vi.financial.v1.12 — Chương 06: Dùng thử và khoảng chờ trước khi mua

**Năng lực:** safety.renewals-and-deliberate-buying  
**Mục tiêu:** Nhận diện ngày gia hạn, kiểm trạng thái hủy và so quyết định mua có điều kiện mà không phán xét sở thích.  
**Trạng thái:** authored-not-independent-review · reviewedAt: 2026-10-23 · 426 đơn vị cách trắng trong thân bài

Dùng thử miễn phí có thể chuyển thành gói trả tiền nếu bạn không hủy theo điều kiện đã đồng ý. Trước khi bắt đầu, hãy tìm giá sau dùng thử, chu kỳ, ngày gia hạn và cách hủy thực tế. Một nhãn miễn phí không nói hết các điều kiện. Nếu chưa hiểu, bạn có thể chưa đăng ký. Tương tự, xóa biểu tượng ứng dụng khỏi điện thoại không tự chứng minh một gói đăng ký đã hủy; cần xem trạng thái tại nơi quản lý gói và giữ xác nhận nếu có.

Ví dụ giả lập: Yến đang trả 79.000đ mỗi tháng cho dịch vụ A và 49.000đ cho dịch vụ B. Tổng theo tháng là 128.000đ. Nếu cả hai giữ nguyên giá, hoạt động đủ mười hai tháng và không có phí khác, tổng là 1.536.000đ. Yến cũng đang xem một món đồ giá 450.000đ, dự kiến dùng sáu lần. Giá chia số lần là 75.000đ mỗi lần theo dự định đó; chưa chứng minh Yến chắc chắn dùng đủ sáu lần. Các con số giúp nhìn quy mô và giả định, không tự ra quyết định thay Yến.

Một khoảng chờ tự chọn trước món mua linh hoạt có thể cho bạn thời gian so với kế hoạch, đọc điều kiện và xem nhu cầu còn phù hợp không. Có thể ghi lại món định mua rồi quay lại vào thời điểm bạn chọn. Đây là mẹo suy nghĩ, không phải thời hạn pháp lý được bảo đảm, cũng không áp dụng cứng cho thuốc hay nhu cầu cấp thiết. Hết khoảng chờ, mua hoặc không mua đều có thể hợp lý tùy điều kiện. Không cần giữ một chuỗi ngày nhịn mua để chứng minh bạn biết quản lý tiền.

Trong Picket, đánh dấu một khoản định kỳ cần xem lại không có nghĩa dịch vụ bên ngoài đã hủy. Nếu muốn hủy thật, hãy tự thực hiện ở kênh chính thức và xác nhận kết quả trước khi sửa lịch tương lai. Một khoản đã bị thu vẫn là sự việc cần ghi đúng; yêu cầu hoàn tiền chưa được duyệt không nên ghi là tiền đã về. Nhắc trước gia hạn chỉ bật khi bạn chọn và cần tránh nhắc trùng. Thực hành bài này có thể chỉ là rà hai ví dụ hoặc viết câu hỏi về điều kiện dùng thử. Không cần đăng ký gói, mua món đồ hay cung cấp thẻ để hoàn thành bài; mục tiêu là giữ lựa chọn của bạn rõ ràng.

### Ví dụ và số học

79.000 + 49.000 = 128.000đ/tháng; 128.000 × 12 = 1.536.000đ/năm theo giả định; 450.000 / 6 = 75.000đ/lần dự kiến.

- `79000+49000 = 128000`
- `128000*12 = 1536000`
- `450000/6 = 75000`

### Tình huống thực hành

**1. Xóa ứng dụng khỏi điện thoại có đủ chứng minh gói đã hủy?**

- A. Có, luôn tự hủy — Xóa app và hủy đăng ký là hai thao tác khác nhau.
- B. Không, cần kiểm trạng thái nơi quản lý đăng ký — Đúng: cần xác nhận tại kênh quản lý chính thức.
- C. Có nếu không mở app — Không sử dụng không tự thay điều kiện thanh toán.
Đáp án: **B** (`correctIndex: 1`).

**2. Hai gói giữ nguyên giá trong 12 tháng như ví dụ. Tổng?**

- A. 128.000đ — Đây là tổng một tháng.
- B. 1.536.000đ — Đúng: 128.000 nhân mười hai.
- C. 450.000đ — Đây là giá món đồ khác, không phải hai gói.
Đáp án: **B** (`correctIndex: 1`).

**3. Picket đánh dấu cần xem lại gói B. Có thể coi đã ngừng tính phí chưa?**

- A. Có ngay khi đánh dấu — Ghi chú trong Picket không điều khiển dịch vụ bên ngoài.
- B. Có sau một ngày chờ bất kỳ — Khoảng chờ tự chọn không làm thay đổi hợp đồng.
- C. Chưa, phải hủy và xác nhận ở nhà cung cấp/kênh quản lý — Đúng: chỉ cập nhật lịch khi biết kết quả thực tế.
Đáp án: **C** (`correctIndex: 2`).

### Hành động tự chọn

Rà giá/ngày gia hạn trên một ví dụ hoặc gói có sẵn; có thể bỏ qua, không đăng ký thêm. Có thể bỏ qua; không cần chi tiền, mở sản phẩm, cung cấp OTP hoặc gửi dữ liệu cho AI.

### Nguồn đã đọc

- [Nguồn tham khảo](https://consumer.ftc.gov/articles/getting-and-out-free-trials-auto-renewals-and-negative-option-subscriptions)

## Kiểm tra bản biên soạn

- Đủ 12 bài, 36 câu hỏi, 108 lựa chọn có lời giải riêng.
- 30 phép tính được chạy và so giá trị mong đợi bằng script đi kèm.
- Tất cả ID duy nhất; mọi chỉ số đáp án thuộc 0–2.
- Nguồn được mở đọc ngày 2026-10-23; URL được lưu để kiểm tra lại trước phát hành. Không phải cam kết URL tồn tại vĩnh viễn.
- Chưa có người duyệt độc lập, người học pilot, nghiệm thu nội dung tiếng Anh hoặc xác nhận hiệu quả giáo dục thực tế.
