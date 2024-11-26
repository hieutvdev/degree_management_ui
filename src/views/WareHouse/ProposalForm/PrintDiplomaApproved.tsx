import style from "./pdfApproved.module.scss";

const PrintDiplomaApproved = ({ innerRef }: { innerRef: any }) => {
  return (
    <div ref={innerRef} className={style.main}>
      <div className={style.topTitle}>
        <div className={style.topTitleLeft}>
          <div>
            <span>BỘ GIÁO DỤC VÀ ĐÀO TẠO</span>
          </div>
          <div>
            <span>TRƯỜNG ĐẠI HỌC ĐẠI NAM</span>
          </div>
          <hr></hr>
        </div>
        <div className={style.topTitleRight}>
          <div>
            <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
          </div>
          <div>
            <span>Độc lập - Tự do - Hạnh phúc</span>
          </div>
          <hr></hr>
          <div>
            <span>
              Hà Nội, ngày {new Date().getDate()} tháng{" "}
              {new Date().getMonth() + 1} năm {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
      <div className={style.title}>
        <div>
          <span>PHIẾU CẤP PHÔI BẰNG CHỨNG CHỈ TỐT NGHIỆP</span>
        </div>
      </div>
      <div className={style.body}>
        <p className={style.tab}>
          Vào hồi {new Date().getHours()} giờ {new Date().getMinutes()} phút,
          ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
          {new Date().getFullYear()}, tại kho lưu trữ văn bằng
        </p>
        <p className={style.tab}>Trường Đại học Đại Nam, chúng tôi bao gồm:</p>
        <div className={style.member}>
          <div>
            <div>
              <div>
                <p>1. Ban gíam hiệu: </p>
              </div>
              <div>
                <p> Ông/bà: Lương Cao Đông</p>
              </div>
            </div>
            <div>
              <div>
                <p>2. Phòng đào tạo: </p>
              </div>
              <div>
                <p> Ông/bà: Đỗ Thu Hương</p>
              </div>
            </div>
            <div>
              <div>
                <p>3. Cán bộ đề xuất: </p>
              </div>
              <div>
                <p> Ông/bà: Lê Trung Hiếu</p>
              </div>
            </div>
          </div>
          <div className={style.role}>
            <div>
              <p>Chức vụ: Hiệu Trưởng</p>
            </div>
            <div>
              <p>Chức vụ: Trưởng phòng đào tạo</p>
            </div>
            <div>
              <p>Chức vụ: Chuyên viên</p>
            </div>
          </div>
        </div>
        <table className={style.table}>
          <thead>
            <tr>
              <th rowSpan={2}>TT</th>
              <th rowSpan={2}>Tên phôi văn bằng, chứng chỉ</th>
              <th rowSpan={2}>Đơn vị tính</th>
              <th rowSpan={2}>Số lượng</th>
              <th colSpan={2}>Số seri</th>
              <th rowSpan={2}>Ghi chú</th>
            </tr>
            <tr>
              <th>Số đầu</th>
              <th>Số cuối</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Thạc sĩ</td>
              <td>Chiếc</td>
              <td>400</td>
              <td>000159</td>
              <td>000558</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>Cộng</td>
              <td></td>
              <td colSpan={3}>400</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <p className={style.tab}>
          Toàn bộ số phôi bằng, chứng chỉ trên không bị rách, nhàu nát, ẩm ướt
          và bẩn.
        </p>
        <p className={style.tab}>
          Ông/bà Lê Trung Hiếu đã kiểm tra, nhận đủ số phôi bằng, chứng chỉ nói
          trên và ký nhận vào biên bản và giao nhận.
        </p>
        <p className={style.tab}>
          Biên bản được in thành 03 bản có giá trị như nhau và mỗi bên giữ 01
          bản.
        </p>
        <p className={style.tab}>
          Việc bàn giao kết thúc vào hồi {new Date().getHours()} giờ{" "}
          {new Date().getMinutes()} phút cùng ngày.
        </p>
        <div className={style.signature}>
          <div>
            <span>CÁN BỘ NHẬN PHÔI</span>
          </div>
          <div>
            <span>PHÒNG ĐÀO TẠO</span>
          </div>
          <div>
            <span>BAN GIÁM HIỆU</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDiplomaApproved;
