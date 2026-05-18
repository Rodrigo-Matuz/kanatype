import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { getDataByTypes, type ScriptType } from "@/data";
import type { DisplayHandle, DisplayProps, HiraganaItem } from "@/types/displayTypes";

type Props = DisplayProps & {
  scriptTypes: ScriptType[];
};

const Display = forwardRef<DisplayHandle, Props>(({ onChange, scriptTypes }, ref) => {
  const [current, setCurrent] = useState<HiraganaItem>(() => {
    const data = getDataByTypes(scriptTypes);
    return data[Math.floor(Math.random() * data.length)];
  });

  const next = () => {
    const data = getDataByTypes(scriptTypes);
    const newItem = data[Math.floor(Math.random() * data.length)];
    setCurrent(newItem);
    onChange?.(newItem);
  };

  useImperativeHandle(ref, () => ({ next }));

  useEffect(() => {
    onChange?.(current);
  }, [current, onChange]);

  return (
    <div className="flex flex-col justify-center items-center h-[40vh]">
      <div className="font-bold text-[15rem] select-none">{current.kana}</div>
    </div>
  );
});

Display.displayName = "Display";

export default Display;