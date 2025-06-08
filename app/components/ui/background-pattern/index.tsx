import Balatro from "../../Balatro/Balatro";

type BackgroundPatternProps = {
  isBalatro: boolean;
};

const BackgroundPattern = ({ isBalatro = false }: BackgroundPatternProps) => {
  if (isBalatro) {
    return (
      <div className="w-screen h-screen absolute">
        <Balatro isRotate={false} mouseInteraction={false} pixelFilter={700} />
      </div>
    );
  }

  return <div id="background-pattern"></div>;
};

export default BackgroundPattern;
