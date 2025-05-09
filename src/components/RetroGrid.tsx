import { cn } from "@/lib/utils";

const RetroGrid = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        className
      )}
    >
      <div className="absolute inset-0 [transform:rotateX(35deg)]">
        <div className="animate-grid [background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw] [background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-600 to-transparent to-40%" />
    </div>
  );
};

export default RetroGrid;