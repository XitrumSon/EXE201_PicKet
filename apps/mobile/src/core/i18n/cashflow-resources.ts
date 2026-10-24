export const cashflowVi={
  sync:"Đồng bộ lịch",syncPending:"Còn {{count}} thao tác đang chờ đồng bộ.",syncReady:"Không có thao tác chờ đồng bộ.",syncError:"Chưa đồng bộ được. Lịch trên thiết bị được giữ nguyên; nếu hai thiết bị có lịch khác nhau, cần đối chiếu trước khi gộp.",
  end:"Ngày kết thúc tùy chọn (YYYY-MM-DD)",active:"Lịch đang áp dụng",scenarioMinimum:"Số dư thấp nhất sau mua giả định",
  title:"Kịch bản dòng tiền",back:"Quay lại",notice:"Bản thử nghiệm trên thiết bị. Chỉ tính lịch bạn nhập; không thay đổi giao dịch hay xác nhận bạn có thể chi tiền.",
  opening:"Số dư giả định đầu kỳ",start:"Ngày đầu kỳ (YYYY-MM-DD)",currency:"Tiền tệ (VND, USD…)",amount:"Số tiền mỗi kỳ (số nguyên; chi dùng dấu -)",
  units:"Nhập theo đơn vị nhỏ nhất, không dùng dấu phân cách: VND 1000 = 1.000đ; USD 100 = 1 đô la.",
  once:"Một lần",weekly:"Hàng tuần",monthly:"Hàng tháng",save:"Lưu lịch",remove:"Xóa lịch",edit:"Sửa lịch",cancel:"Hủy sửa",schedules:"Lịch dự kiến",empty:"Chưa có lịch dự kiến.",
  calculate:"Tính kịch bản",seven:"7 ngày",thirty:"30 ngày",error:"Không lưu/tính được. Kiểm tra ngày, tiền tệ và số tiền; nếu lịch đã đổi, tải lại trước khi sửa.",reload:"Tải lại lịch",loading:"Đang tải lịch…",saved:"Đã lưu trên thiết bị.",
  purchaseDay:"Ngày mua giả định (YYYY-MM-DD)",purchaseAmount:"Số tiền mua giả định (số nguyên dương)",purchaseHint:"Để trống cả hai ô nếu không thử mua.",baseline:"Theo lịch",scenario:"Sau mua giả định",minimum:"Số dư thấp nhất theo lịch",unknown:"Chi phí hoặc thu nhập chưa ghi nhận vẫn chưa biết; không mặc định bằng 0.",
};
export const cashflowEn:Record<keyof typeof cashflowVi,string>={
  sync:"Sync schedules",syncPending:"{{count}} operations waiting to sync.",syncReady:"No changes waiting to sync.",syncError:"Could not sync. Device schedules were preserved; different schedules on two devices need reconciliation before merging.",
  end:"Optional end day (YYYY-MM-DD)",active:"Schedule enabled",scenarioMinimum:"Lowest balance after assumed purchase",
  title:"Cashflow scenario",back:"Back",notice:"Device preview. Includes only supplied schedules; it does not change transactions or confirm you can afford a purchase.",
  opening:"Assumed opening balance",start:"Start day (YYYY-MM-DD)",currency:"Currency (VND, USD…)",amount:"Amount per occurrence (integer; use - for expenses)",
  units:"Enter minor units without separators: VND 1000 = 1,000 dong; USD 100 = 1 dollar.",
  once:"Once",weekly:"Weekly",monthly:"Monthly",save:"Save schedule",remove:"Delete schedule",edit:"Edit schedule",cancel:"Cancel editing",schedules:"Expected schedules",empty:"No expected schedules yet.",
  calculate:"Calculate scenario",seven:"7 days",thirty:"30 days",error:"Could not save or calculate. Check dates, currency and amounts; reload before editing if schedules changed.",reload:"Reload schedules",loading:"Loading schedules…",saved:"Saved on this device.",
  purchaseDay:"Assumed purchase day (YYYY-MM-DD)",purchaseAmount:"Assumed purchase amount (positive integer)",purchaseHint:"Leave both fields empty to omit a purchase scenario.",baseline:"Scheduled balance",scenario:"After assumed purchase",minimum:"Lowest scheduled balance",unknown:"Unrecorded expenses and income remain unknown; they are not assumed to be zero.",
};
