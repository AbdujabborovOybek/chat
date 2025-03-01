import "./login.css";
import { PatternFormat } from "react-number-format";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

export const Login = () => {
  const naivgate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;

    const options = {
      method: "POST",
      url: "http://localhost:8080/api/auth/login",
      data: { phone },
    };
    // 90 695 7132

    try {
      const { data } = await axios(options);

      const message = data.message.message;
      enqueueSnackbar(message, { variant: "success" });

      return naivgate("/verify");
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      console.error(error);
    }
  };

  return (
    <div className="login">
      <form className="login_form" onSubmit={handleSubmit}>
        <h1>Real-Time Chat</h1>
        <PatternFormat
          format="+998 ## ### ####"
          allowEmptyFormatting
          mask=" "
          name="phone"
        />
        <button>Login</button>
      </form>
    </div>
  );
};
