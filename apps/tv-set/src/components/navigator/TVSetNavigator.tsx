import React from "react";
import dynamic from "next/dynamic";

//
const FromP5 = dynamic(() => import("p5-playground/Example"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const TvSetNavigator = () => {
  return (
    <main>
      <h3>TV Navigator</h3>
      <div>
        <FromP5 />
      </div>
    </main>
  );
};
