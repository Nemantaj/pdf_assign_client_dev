import { useState, useEffect, useRef } from "react";
import { Button, Text, Divider, Input, Card } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const HomeRoute = (props) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const lteRef = useRef(null);
  const gteRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://nemantajAssign.herokuapp.com/get-contact")
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
        setFetchedData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const sortHandler = () => {
    if (lteRef.current.value && gteRef.current.value) {
      setLoading(true);
      let lte = lteRef.current.value;
      let gte = gteRef.current.value;

      fetch("https://nemantajAssign.herokuapp.com/retrieve-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lte,
          gte,
        }),
      })
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
          setFetchedData(data.result);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const singlePdf = (entryId) => {
    fetch(`https://nemantajAssign.herokuapp.com/get-pdf/${entryId}`)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "contact-" + entryId + ".pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const allPdf = () => {
    if (fetchedData.length > 0) {
      const entryIds = fetchedData.map((doc) => {
        return doc._id;
      });

      fetch(`https://nemantajAssign.herokuapp.com/get-all-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryIds,
        }),
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "contact-All.pdf");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="share_div">
      <Text css={{ fontFamily: "Neon", p: "10px", letterSpacing: "1px" }}>
        ADMIN
      </Text>
      <div className="actions">
        <Button
          size="xs"
          color="error"
          rounded
          css={{
            fontFamily: "Neon",

            alignSelf: "center",
            mb: "10px",
          }}
          onClick={props.setAuthFalse}
        >
          Logout
        </Button>
        <Button
          size="xs"
          color="warning"
          rounded
          css={{
            fontFamily: "Neon",

            alignSelf: "center",
            mb: "10px",
          }}
          onClick={allPdf}
        >
          SAVE PDF
        </Button>
        <Button
          size="xs"
          color="secondary"
          rounded
          css={{
            fontFamily: "Neon",

            alignSelf: "center",
            mb: "10px",
          }}
          onClick={() => navigate("/share")}
        >
          Share
        </Button>
      </div>
      <Divider />
      <div className="date_range">
        <Text
          css={{
            px: "10px",
            br: "20px",
            bgColor: "$accents0",
            fontFamily: "Neon",
            w: "fit-content",
          }}
          size="12px"
        >
          From
          <Input
            aria-label="input"
            type="date"
            size="xs"
            css={{ ml: "5px" }}
            ref={lteRef}
          />
        </Text>
        <Button
          size="xs"
          color="warning"
          rounded
          css={{
            fontFamily: "Neon",
            w: "fit-content",
          }}
          onClick={sortHandler}
        >
          Sort
        </Button>
        <Text
          css={{
            px: "10px",
            br: "20px",
            bgColor: "$accents0",
            fontFamily: "Neon",
            w: "fit-content",
          }}
          size="12px"
        >
          To&nbsp;&nbsp;&nbsp;
          <Input
            aria-label="input"
            type="date"
            size="xs"
            css={{ ml: "5px" }}
            ref={gteRef}
          />
        </Text>
      </div>
      <Divider />
      <div className="contact_list">
        {fetchedData.length > 0 &&
          fetchedData.map((doc, index) => {
            return (
              <Card variant="flat" className="card_container" key={index}>
                <Card.Header className="card_header">
                  <Text css={{ fontFamily: "Neon" }}>{doc.username}</Text>
                  <Text css={{ fontFamily: "Neon" }}>
                    {new Date(doc.createdAt).toLocaleDateString("en-US")}
                  </Text>
                </Card.Header>
                <Divider />
                <Card.Body>
                  {doc.numbers.map((doc) => {
                    return (
                      <Text css={{ fontFamily: "Neon3" }}>* {doc.num}</Text>
                    );
                  })}
                </Card.Body>
                <Divider />
                <Card.Footer className="card_footer">
                  <Button
                    size="xs"
                    color="warning"
                    rounded
                    css={{
                      fontFamily: "Neon",
                    }}
                    onClick={() => singlePdf(doc._id)}
                  >
                    PDF
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default HomeRoute;
