
import styled from "styled-components";

export const InputSection = styled.div<{ $indent: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding-left: ${(props) => props.$indent && "2%"};
  width: 100%;
`;

export const Label = styled.label<{ $isParent?: boolean }>`
  align-self: flex-start;
  font-size: ${(props) => (props.$isParent ? "2em" : "1em")};
`;

export const Input = styled.input<{ $color?: string }>`
    background: #fff;
    border: 1px solid #dadedf;
    border-radius: 4px;
    color: ${props => props.$color || "#514167"};
    font-family: inherit;
    padding: 10px;
    text-align: left;
`
