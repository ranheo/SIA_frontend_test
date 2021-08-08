import styles from "./App.module.css";
import { useState, useEffect, useRef } from "react";

function App({ photos, rectangle }) {
  const canvas = useRef(null);
  const [toolbar, setToolbar] = useState("select");
  const [ctx, setCts] = useState(undefined);
  const [startX, setstartX] = useState();
  const [startY, setstartY] = useState();
  const [photo, setPhoto] = useState();
  const [rects, setrects] = useState([]);

  const onClickToolbar = (selected) => {
    selected === "select" ? setToolbar("select") : setToolbar("box");
  };

  useEffect(() => {
    setCts(canvas.current.getContext("2d"));
  }, []);

  useEffect(() => {
    photos
      .getPhotos() //
      .then((res) => {
        updateCanvas(res.data[0].url, []);
        setPhoto(res.data[0].url);
      });
  }, [ctx]);

  useEffect(() => {
    window.addEventListener("keydown", handleDelete, false);
    return () => window.removeEventListener("keydown", handleDelete, false);
  });

  const updateCanvas = (imgURL, remainedrects) => {
    if (ctx) {
      var img = new Image();
      img.src = imgURL;
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.current.width, canvas.current.height);
        remainedrects !== [] &&
          remainedrects.map((rect) => {
            rectangle.draw(
              ctx,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              rect.stroke
            );
          });
      };
    }
  };

  function handleMouseUp(e) {
    if (toolbar == "box") {
      var canvasrect = canvas.current.getBoundingClientRect();

      setrects([
        ...rects,

        {
          id: Date.now(),
          x: startX - canvasrect.left,
          y: startY - canvasrect.top,
          width: e.clientX - startX,
          height: e.clientY - startY,
          stroke: "black",
          strokewidth: 10,
        },
      ]);
      rectangle.draw(
        ctx,
        startX - canvasrect.left,
        startY - canvasrect.top,
        e.clientX - startX,
        e.clientY - startY,
        "black"
      );
    }
  }

  function handleMouseDown(e) {
    const canvasrect = canvas.current.getBoundingClientRect();
    const mouseX = parseInt(e.clientX - canvasrect.left);
    const mouseY = parseInt(e.clientY - canvasrect.top);

    if (toolbar == "box") {
      setstartX(e.clientX);
      setstartY(e.clientY);
    } else {
      const filterRects = rects.map((rect) => {
        if (
          rectangle.isPointInside(
            mouseX,
            mouseY,
            rect.x,
            rect.y,
            rect.width,
            rect.height
          )
        ) {
          if (rect.stroke == "black") {
            rect.stroke = "orange";
            rectangle.draw(
              ctx,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              "orange"
            );
          } else {
            rect.stroke = "black";
            rectangle.draw(
              ctx,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              "black"
            );
          }
        }
        return rect;
      });

      setrects([...filterRects]);
    }
  }

  const handleDelete = (e) => {
    if ((e.key == "Backspace" || e.key == "Delete") && toolbar == "select") {
      const filterRects = rects.filter((rect) => {
        if (rect.stroke !== "orange") {
          return rect;
        }
      });

      setrects([...filterRects]);
      updateCanvas(photo, filterRects);
    }
  };

  return (
    <>
      <div className={styles.setting}>
        <ul className={styles.items}>
          <li className={styles.minimize}></li>
          <li className={styles.smaller}></li>
          <li className={styles.quit}></li>
        </ul>
      </div>
      <header className={styles.header}>
        <p className={styles.logo}>Dataset Label</p>
      </header>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li
              className={`${styles.select} ${
                toolbar === "select" && styles.active
              }`}
              onClick={() => {
                onClickToolbar("select");
              }}
            ></li>
            <li
              className={`${styles.boundingBoxCreate} ${
                toolbar === "box" && styles.active
              }`}
              onClick={() => {
                onClickToolbar("box");
              }}
            ></li>
          </ul>
        </nav>
        <main className={styles.main}>
          <canvas
            ref={canvas}
            width={800}
            height={800}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </main>
      </div>
    </>
  );
}

export default App;
