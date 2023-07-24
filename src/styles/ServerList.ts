import styled, {css} from "styled-components";

export const ServerListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  color: var(--text);
`;

interface ServerListTableHeaderProps {
    isSorted?: boolean;
    sortDirection?: "asc" | "desc";
}

export const ServerListTableHeader = styled.th<ServerListTableHeaderProps>`
  background-color: var(--secondary);
  padding: 10px;
  cursor: pointer;

  ${({ isSorted, sortDirection }) => isSorted && css`
    position: relative;

    &::after {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 5px;
      vertical-align: middle;
      border: 5px solid transparent;
    }

    ${sortDirection === "asc" && css`
      &::after {
        border-bottom-color: var(--text);
      }
    `}

    ${sortDirection === "desc" && css`
      &::after {
        border-top-color: var(--text);
      }
    `}
  `}
`;

export const ServerListTableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--secondary);
  }
`;

export const ServerListTableData = styled.td`
  padding: 10px;
  text-align: center;
`;

export const ServerListFilterWrapper = styled.div`
  margin-top: 10px;
`;

export const ServerListFilterLabel = styled.label`
  margin-right: 10px;
  color: var(--text);
`;

export const ServerListSearchInput = styled.input`
  margin-left: 10px;
`;

export const ServerListSelect = styled.select`
  height: 100px;
  width: 200px;
  padding: 5px;
  font-size: 16px;
`;