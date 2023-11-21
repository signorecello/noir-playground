
import styled from "styled-components";

export const InputSection = styled.div<{ $indent: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding-left: ${(props) => props.$indent && "2%"};
`;

export const Label = styled.label<{ $isParent?: boolean }>`
  align-self: flex-start;
  font-size: ${(props) => (props.$isParent ? "2em" : "1em")};
`;
