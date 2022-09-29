import { useState } from "react";
import { Input, Text, Button, Divider, Loading } from "@nextui-org/react";
import useInput from "../hooks/useInput";
import { useNavigate } from "react-router-dom";

const ShareRoute = () => {
  const [number, addNumber] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    inputValue: nameValue,
    error: nameError,
    isValid: nameValid,
    inputHandler: nameHandler,
    blurHandler: nameBlur,
    clearInput: clearName,
  } = useInput((value) => value !== "");

  const {
    inputValue: numberValue,
    error: numberError,
    isValid: numberValid,
    inputHandler: numberHandler,
    blurHandler: numberBlur,
    clearInput: clearNumber,
  } = useInput((value) => value !== "" && value.length == 10);

  const pushToNumber = (newNum) => {
    let newNumber = [...number, newNum];
    addNumber(newNumber);
    clearNumber();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (nameValid && number.length > 0) {
      setLoading(true);
      fetch("https://nemantajAssign.herokuapp.com/post-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameValue,
          numbers: number,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log(
              "There was a problem while sending data to the server!"
            );
          }
          clearName();
          addNumber([]);
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
      <Text css={{ fontFamily: "Neon", p: "10px" }}>Share your details</Text>
      <Button
        auto
        size="sm"
        color="success"
        rounded
        css={{
          fontFamily: "Neon",
          w: "fit-content",
          alignSelf: "center",
          mb: "10px",
        }}
        onClick={() => navigate("/auth")}
      >
        Login
      </Button>
      <Divider />
      <form className="share_form" onSubmit={submitHandler}>
        <Input
          type="text"
          aria-label="Name"
          label="Enter your name"
          placeholder="Full Name"
          css={{ fontFamily: "Neon3", w: "100%" }}
          onChange={nameHandler}
          onBlur={nameBlur}
          value={nameValue}
        />
        <Input
          type="number"
          aria-label="Number"
          label="Contact number"
          placeholder="+91"
          css={{ fontFamily: "Neon3", w: "100%" }}
          onChange={numberHandler}
          onBlur={numberBlur}
          value={numberValue}
        />
        {numberValue.length == 10 && (
          <Button
            css={{
              fontFamily: "Neon",
              w: "fit-content",
              alignSelf: "end",
            }}
            rounded
            size="xs"
            onClick={() => pushToNumber(numberValue)}
          >
            +Add
          </Button>
        )}
        <div className="number_list">
          {number.length > 0 &&
            number.map((doc) => {
              return (
                <Text
                  color="$pink800"
                  css={{
                    fontFamily: "Neon3",
                    bgColor: "$pink100",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                  }}
                >
                  {doc}
                </Text>
              );
            })}
        </div>
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
          {loading ? <Loading type="spinner" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ShareRoute;
