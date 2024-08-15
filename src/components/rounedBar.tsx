import { BarProps } from "recharts";

const RoundedBar = (props: BarProps) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  const xWithWidth = x && width ? Number(x) + width : 0;
  const yWithHeight = height ? Number(y) + height : 0;
  const yWithRadius = Number(y) + radius;
  const xWithRadius = Number(x) + radius;
  return (
    <path
      d={`M${x},${yWithHeight} 
         L${x},${yWithRadius} 
         Q${x},${y} ${xWithRadius},${y} 
         L${xWithWidth - radius},${y} 
         Q${xWithWidth},${y} ${xWithWidth},${yWithRadius} 
         L${xWithWidth},${yWithHeight} 
         Z`}
      fill={fill}
    />
  );
};

export default RoundedBar;
