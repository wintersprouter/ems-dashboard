import { BarProps } from "recharts";

const RoundedBar = (props: BarProps) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  const xWithWidth = x + width;
  const yWithHeight = y + height;
  const yWithRadius = y + radius;
  return (
    <path
      d={`M${x},${yWithHeight} 
         L${x},${yWithRadius} 
         Q${x},${y} ${x + radius},${y} 
         L${xWithWidth - radius},${y} 
         Q${xWithWidth},${y} ${xWithWidth},${yWithRadius} 
         L${xWithWidth},${yWithHeight} 
         Z`}
      fill={fill}
    />
  );
};

export default RoundedBar;
