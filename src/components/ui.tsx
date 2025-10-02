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

export const TodoLi = styled.li`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px;
  background: ${({ theme }) => theme.card};
  border-radius: 6px;
`;

export const TodoText = styled.div<{ completed: boolean }>`
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ theme }) => theme.text};
`;

export const SubText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.sub};
`;

export const TodoButton = styled.button`
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  padding: 4px 8px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  &:hover {
    opacity: 0.9;
  }
`;

export const TodoInput = styled.input`
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.card};
`;

export const TodoUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px; /* расстояние между задачами */
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const SortGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

export const AppContainer = styled.div`
  max-width: 860px;
  margin: 24px auto;
  padding: 12px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`;

export const Content = styled.div`
  max-width: 720px;
  margin: 24px auto;
  padding: 12px;
`;

export const ThemeButton = styled.button`
  margin-left: auto;
  padding: 6px 12px;
  cursor: pointer;
`;

export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const Label = styled.label.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ theme, active }) => (active ? theme.accent : theme.text)};
`;

export const SortButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  background-color: ${({ theme, active }) => (active ? theme.accent : theme.card)};
  color: ${({ theme, active }) => (active ? "#fff" : theme.text)};
  transition: background 0.2s;
`;