import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

interface Props {
  explanation: string;
  side: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const QuestionMark = ({ explanation, side }: Props) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useGSAP(
    () => {
      if (show) {
        gsap.to(".question-mark-explanation", {
          duration: 0.3,
          scale: 1,
          ease: "power2.in",
        });
      } else {
        gsap.to(".question-mark-explanation", {
          duration: 0.3,
          scale: 0,
          ease: "power2.in",
        });
      }
    },
    { scope: mainRef, dependencies: [show] }
  );

  return (
    <div ref={mainRef} className={`question-mark ${side}`}>
      <button
        onMouseEnter={() => {
          setShow(true);
        }}
        onClick={() => {
          setShow(!show);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
        className="question-mark-button"
      >
        ?
      </button>
      <div className="question-mark-explanation">
        <span>{explanation}</span>
      </div>
    </div>
  );
};
export default QuestionMark;
