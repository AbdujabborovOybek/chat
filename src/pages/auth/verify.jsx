import "./login.css";
import { PatternFormat } from "react-number-format";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const Verify = () => {
  const naivgate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = e.target.code.value.replace(/\s/g, "");

    const options = {
      method: "POST",
      url: "https://chat.abdujabborov.uz/api/auth/verify",
      data: { code },
    };

    try {
      const { data } = await axios(options);

      const message = data.message;
      enqueueSnackbar(message, { variant: "success" });
      localStorage.setItem("user", JSON.stringify(data?.innerData?.user));
      localStorage.setItem("token", data?.innerData?.token);
      return naivgate("/");
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "info" });
      console.error(error);
    }
  };

  return (
    <div className="login">
      <form className="login_form" onSubmit={handleSubmit}>
        <h1>Real-Time Chat</h1>
        <PatternFormat
          format="### ###"
          allowEmptyFormatting
          mask=" "
          style={{ textAlign: "center" }}
          placeholder="Enter the code"
          name="code"
        />
        <button>Verify</button>
      </form>
    </div>
  );
};
