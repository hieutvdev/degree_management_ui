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
          <span>PHIẾU XUẤT KHO PHÔI VĂN BẰNG TỐT NGHIỆP</span>
        </div>
        <div>
          <span>TRÌNH ĐỘ: {"THẠC SĨ"}</span>
        </div>
      </div>
      <div className={style.body}>
        <table className={style.table1}>
          <thead>
            <tr>
              <th rowSpan={2}>STT</th>
              <th rowSpan={2}>Ngày xuất kho</th>
              <th rowSpan={2}>Trình độ/Hình thức đào tạo</th>
              <th rowSpan={2}>Loại phôi</th>
              <th rowSpan={2}>Số lượng phôi</th>
              <th colSpan={2}>Số Seri phôi</th>
            </tr>
            <tr>
              <th>Số bắt đầu</th>
              <th>Số kết thúc</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                {new Date().getDate()}/{new Date().getMonth() + 1}/
                {new Date().getFullYear()}
              </td>
              <td>{"Ths"}</td>
              <td>{"Thạc sĩ"}</td>
              <td>400</td>
              <td>000159</td>
              <td>000558</td>
            </tr>
            <tr>
              <td colSpan={3}>Cộng</td>
              <td></td>
              <td colSpan={3}>400</td>
            </tr>
          </tbody>
        </table>
        <p>
          Tổng cộng {"("}viết bằng chữ{")"}: {"Bốn trăm phôi bằng"}
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

export default PrintIssueDiplomas;
