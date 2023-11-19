import styled from "styled-components"

export const StyledButton = styled.button<{ disabled?: boolean }>`
    width: 100px;
    margin: 10px;
    border-radius: 8px;
    border: 2px solid var(--green-600, #00694D);
    background: var(--green-400, #2FA483);
    color: #FFF;
    text-align: right;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 15px */
    display: flex;
    height: 40px;
    padding: 12px 24px 12px 16px;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    opacity: ${props => props.disabled ? 0.5 : 1};
`
