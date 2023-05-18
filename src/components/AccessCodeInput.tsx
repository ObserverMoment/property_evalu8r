// import styled from "@emotion/styled";
// import { MyTheme } from "./styled/theme";
// import { useEffect, useRef, useState } from "react";
// import { FlexRow, MySpacer } from "./styled/layout";
// import { PrimaryButton } from "./styled/styled";
// import { Spin } from "antd";

// interface AccessCodeInputProps {
//   handleSubmitAccessCode: (accessCode: string) => void;
//   loadingSubmitCode: boolean;
// }

// export const AccesscodeInput = ({
//   handleSubmitAccessCode,
//   loadingSubmitCode,
// }: AccessCodeInputProps) => {
//   const numberOfInputs = 6;

//   const [cursorIndex, setCursorIndex] = useState(0);
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
//   const [values, setValues] = useState<(number | null)[]>(
//     Array.from(Array(numberOfInputs)).map(() => null)
//   );

//   useEffect(() => {
//     inputRefs.current[0]?.focus();
//   }, []);

//   const updateInputAtIndex = (value: number | null, index: number) => {
//     if (index >= 0 && index < numberOfInputs) {
//       setValues((values) => values.map((v, i) => (i === index ? value : v)));
//     }
//   };

//   const focusInputAtIndex = (index: number) => {
//     if (index >= 0 && index < numberOfInputs) {
//       inputRefs.current[index]?.focus();
//       setCursorIndex(index);
//     }
//   };

//   const handleOnFocus = (
//     e: React.FocusEvent<HTMLInputElement, Element>,
//     index: number
//   ) => {
//     e.target.select();
//     setCursorIndex(index);
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if ([event.code, event.key].includes("Backspace")) {
//       event.preventDefault();
//       updateInputAtIndex(null, cursorIndex);
//       focusInputAtIndex(cursorIndex - 1);
//     } else if (event.code === "Delete") {
//       event.preventDefault();
//       updateInputAtIndex(null, cursorIndex);
//     } else if (event.code === "ArrowLeft") {
//       event.preventDefault();
//       focusInputAtIndex(cursorIndex - 1);
//     } else if (event.code === "ArrowRight") {
//       event.preventDefault();
//       focusInputAtIndex(cursorIndex + 1);
//     }
//     // React does not trigger onChange when the same value is entered
//     // again. So we need to focus the next input manually in this case.
//     else if (event.key === values[cursorIndex]?.toString()) {
//       event.preventDefault();
//       focusInputAtIndex(cursorIndex + 1);
//     } else if (
//       event.code === "Spacebar" ||
//       event.code === "Space" ||
//       event.code === "ArrowUp" ||
//       event.code === "ArrowDown"
//     ) {
//       event.preventDefault();
//       // Else if is a number then update value and increase cursor index
//     } else if (/^[0-9]$/i.test(event.key)) {
//       event.preventDefault();
//       updateInputAtIndex(parseInt(event.key), cursorIndex);
//       focusInputAtIndex(cursorIndex + 1);
//     } else if (!(event.ctrlKey || event.metaKey)) {
//       /// If user is not pasting, prevent deafult.
//       event.preventDefault();
//     }
//   };

//   const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
//     event.preventDefault();

//     // Get pastedData in an number[] of size num inputs
//     const cleanedPastedData = event.clipboardData
//       .getData("text/plain")
//       .slice(0, numberOfInputs)
//       .split("")
//       .map((v) => (!isNaN(Number(v)) ? parseInt(v) : null));

//     setValues(cleanedPastedData);
//     focusInputAtIndex(numberOfInputs - 1);
//   };

//   return (
//     <AccessCodeInputContainer>
//       <div style={{ color: MyTheme.colors.primary }}>Enter access code</div>
//       <div style={{ color: MyTheme.colors.primary, fontSize: "0.9em" }}>
//         (You can copy and paste!)
//       </div>

//       <MySpacer height={12} />

//       <FlexRow>
//         {Array.from(Array(numberOfInputs)).map((_, i) => (
//           <StyledCodeInput
//             key={i}
//             type="number"
//             value={values[i] ?? ""}
//             onChange={(e) => e.preventDefault()}
//             ref={(element) => (inputRefs.current[i] = element)}
//             onFocus={(e) => handleOnFocus(e, i)}
//             maxLength={1}
//             onKeyDown={handleKeyDown}
//             onPaste={handlePaste}
//             aria-label={`Please enter OTP character ${i + 1}`}
//           />
//         ))}
//       </FlexRow>
//       <MySpacer height={16} />

//       {loadingSubmitCode ? (
//         <Spin size="small" />
//       ) : (
//         <PrimaryButton
//           disabled={values.some((v) => v === null || isNaN(v))}
//           onClick={() => handleSubmitAccessCode(values.join(""))}
//         >
//           Submit Code
//         </PrimaryButton>
//       )}
//     </AccessCodeInputContainer>
//   );
// };

// const AccessCodeInputContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// const StyledCodeInput = styled.input`
//   width: 44px;
//   height: 44px;
//   border-radius: 8px;
//   margin: 6px;
//   font-size: 28px;
//   outline: none;
//   text-align: center;
// `;
