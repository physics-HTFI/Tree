import React, { useState, useRef, useCallback, useEffect } from "react";

export const ResizableContainer = ({
  initialWidth = 300,
  initialHeight = 300,
  children,
}: {
  initialWidth?: number;
  initialHeight?: number;
  children: React.ReactNode;
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWidthRef = useRef(width);
  const startHeightRef = useRef(height);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      startWidthRef.current = width;
      startHeightRef.current = height;
    },
    [width, height],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;
      let newWidth = startWidthRef.current - deltaX;
      let newHeight = startHeightRef.current + deltaY;
      const [minWidth, minHeight] = [100, 100];
      if (newWidth < minWidth) newWidth = minWidth;
      if (newHeight < minHeight) newHeight = minHeight;
      setWidth(newWidth);
      setHeight(newHeight);
    },
    [isDragging],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "all-scroll";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return (
    <div
      style={{
        width,
        height,
        minHeight: height === initialHeight ? undefined : height, // 初期状態では height は親コンテナ側から決める
        position: "relative",
      }}
    >
      {/* 中身 */}
      {children}

      {/* 左下端のドラッグハンドル */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: isDragging ? "100%" : 10, // fix: iframe 内に入るとドラッグできなくなる
          height: "100%",
          cursor: "all-scroll",
          background: "transparent",
        }}
      />
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: isDragging ? "100%" : 10,
          cursor: "all-scroll",
          background: "transparent",
        }}
      />
    </div>
  );
};
