import style from "./pdf.module.scss";

const PrintIssueDiplomas = ({ innerRef }: { innerRef: any }) => {
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
          <span>PHIẾU ĐỀ XUẤT</span>
        </div>
        <div>
          <span>Kính gửi: BAN GIÁM HIỆU</span>
        </div>
      </div>
      <div className={style.body}>
        <p>
          Kính đề nghị Ban Giám Hiệu cấp cho Phòng Đào tạo phôi bằng tốt nghiệp{" "}
          {"Thạc sĩ"} để in và cấp cho học viên tốt nghiệp năm{" "}
          {new Date().getFullYear()} cụ thể như sau:
        </p>
        <p>
          1. Kết quả tốt nghiệp theo Quyết định số 10806/QĐ-ĐT-ĐN ngày{" "}
          {new Date().getDate()}/{new Date().getMonth() + 1}/
          {new Date().getFullYear()} về việc Công nhận sinh viên đủ điều kiện
          tốt nghiệp của Hiệu trưởng Trường Đại học Đại Nam
        </p>
        <table border={1} className={style.table1}>
          <thead>
            <tr>
              <th>TT</th>
              <th>Chuyên ngành đào tạo</th>
              <th>Khóa học</th>
              <th>Sinh viên tốt nghiệp</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Quản lý kinh tế</td>
              <td>5</td>
              <td>200</td>
              <td></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Tài chính ngân hàng</td>
              <td>4</td>
              <td>200</td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={3}>Cộng</td>
              <td>400</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <p className={style.p2}>2. Số lượng đề nghị cấp</p>
        <table border={1} className={style.table2}>
          <thead>
            <tr>
              <th>TT</th>
              <th>Loại bằng</th>
              <th>Số lượng SV theo Quyết định tốt nghiệp</th>
              <th>Số lượng đề nghị cấp</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{"Thạc sĩ"}</td>
              <td>24</td>
              <td>24</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>Cộng</td>
              <td>24</td>
              <td>24</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <p>Rất mong nhận được sự chấp thuận của Ban Giám Hiệu nhà trường.</p>
        <p>
          Phòng Đào tạo xin đảm bảo quản lý và cấp phát văn bằng theo đúng quy
          chế cấp phát văn bằng chứng chỉ của Trường Đại học Đại Nam.
        </p>
      </div>
    </div>
  );
};

export default PrintIssueDiplomas;
