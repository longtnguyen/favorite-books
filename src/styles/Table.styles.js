import styled from 'styled-components';

export const StyledTableWrapper = styled.div`
  width: 100%;

  .rank-col {
    width: 50px;
    text-align: center;
  }

  .cover-col {
    width: 60px;
  }

  .book-cover {
    width: 40px;
    height: 60px;
    object-fit: cover;
    display: block;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
`;
