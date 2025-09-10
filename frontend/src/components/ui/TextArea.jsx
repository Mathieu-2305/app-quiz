import React from "react";
import styled from "styled-components";

export default function TextArea({ rows = 3, ...props }) {
  return <Area rows={rows} {...props} />;
}


const Area = styled.textarea`
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
    resize: vertical;
    background-color: var(--color-background-elevated);
    color: var(--color-text);
    font: inherit;
    line-height: 1.4;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    }

    &::placeholder {
        color: #9ca3af;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
