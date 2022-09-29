import { useState } from "react";
import { Input, Text, Button, Divider, Loading } from "@nextui-org/react";
import useInput from "../hooks/useInput";
import { useNavigate } from "react-router-dom";

const AuthRoute = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    inputValue: nameValue,
    error: nameError,
    isValid: nameValid,
    inputHandler: nameHandler,
    blurHandler: nameBlur,
  } = useInput((value) => value !== "");

  const submitHandler = (event) => {
    event.preventDefault();
    if (nameValid) {
      setLoading(true);
      fetch("https://nemantajAssign.herokuapp.com/login/" + nameValue)
        .then((res) => {
          if (!res.ok) {
            console.log("There was an error!");
          }
          return res.json();
        })
        .then((data) => {
          if (!data.result) {
            console.log("There was an error!");
          }
          localStorage.setItem("auth", data.result._id);
          props.setAuthTrue();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="share_div">
      <Text css={{ fontFamily: "Neon", p: "10px" }}>Login to your account</Text>
      <Button
        auto
        size="sm"
        color="secondary"
        rounded
        css={{
          fontFamily: "Neon",
          w: "fit-content",
          alignSelf: "center",
          mb: "10px",
        }}
        onClick={() => navigate("/share")}
      >
        Share
      </Button>
      <Divider />
      <form className="share_form" onSubmit={submitHandler}>
        <Input
          type="text"
          aria-label="Name"
          label="Enter your username"
          placeholder="Username"
          css={{ fontFamily: "Neon3", w: "100%" }}
          onChange={nameHandler}
          onBlur={nameBlur}
        />
        <Divider />
        <Button
          css={{
            fontFamily: "Neon",
            w: "fit-content",
            alignSelf: "end",
            mt: "10px",
          }}
          rounded
          type="submit"
          disabled={loading ? true : false}
        >
          {loading ? <Loading type="spinner" /> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default AuthRoute;
