import { useEffect, useState } from 'react';

interface StringSpinnerProps {
  strings: { name: string }[];
  interval?: number;
}

const StringSpinner = ({ strings, interval = 100 }: StringSpinnerProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, interval);

    return () => clearInterval(timer);
  }, [strings, interval]);

  // 計算上一個和下一個索引
  const prevIndex = index === 0 ? strings.length - 1 : index - 1;
  const nextIndex = (index + 1) % strings.length;

  // 需要顯示的三個字符串
  const itemsToShow = [strings[prevIndex], strings[index], strings[nextIndex]];

  return (
    <div className="flex h-64 flex-col items-stretch justify-center gap-2 divide-y overflow-hidden">
      {itemsToShow.map((item) => (
        <div
          key={crypto.randomUUID()}
          className="inline-block h-1/3 flex-1 text-center text-6xl"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default StringSpinner;
