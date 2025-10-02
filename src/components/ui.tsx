import styled from "styled-components";

export const Container = styled.div`
  max-width: 860px;
  margin: 24px auto;
  padding: 12px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Button = styled.button`
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: transparent;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;
