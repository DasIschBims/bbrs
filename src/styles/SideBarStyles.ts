import styled, {keyframes} from "styled-components";

const slideFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const SideBarContainer = styled.div`
  height: 100%;
`;

export const SideBarContent = styled.div`
  height: 100%;
  display: flex;
`;

export const SideBarLogo = styled.div`
  border-radius: 50%;

  img {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

export const SideBarClosed = styled.div`
  max-width: 64px;
  width: 100%;
  height: 100%;
  border-radius: 0 12px 12px 0;
  background-color: var(--secondary);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  svg {
    color: var(--text);
  }

  nav {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;

    > button {
      width: 100%;
      padding: 16px 0;
      background: none;
      cursor: pointer;
      border: none;

      &:hover {
        svg {
          path {
            color: var(--primary);
          }
        }
      }
    }

    > button svg {
      height: 24px;
      width: 24px;

      color: var(--text);
    }

    div {
      img {
        width: 48px;
        height: 48px;
        filter: invert(100%);
      }
    }

    ul {
      margin-top: 4px;
      width: 100%;
      text-align: center;

      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 0;
      gap: 4px;

      a {
        width: 100%;
        padding: 16px 0;
        border-radius: 8px 0 0 8px;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: background-color 0.3s;

        &:hover {
          background-color: var(--accent);

          svg {
            path {
              color: var(--secondary);
            }
          }
        }

        &.active {
          background-color: var(--primary);
          border-radius: 0 8px 8px 0;
          
            svg {
                path {
                    color: var(--secondary);
                }
            }
        }

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
`;

export const SideBarOpened = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;

  svg {
    color: var(--text);
  }

  section {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    width: 240px;

    background-color: var(--secondary);
    border-radius: 0 12px 12px 0;

    ul li {
      cursor: pointer;
    }

    > span {
      width: 100%;
      display: flex;
      align-items: flex-start;

      button {
        padding: 16px;
        background: none;
        cursor: pointer;
        border: none;

        &:hover {
          svg {
            path {
              color: var(--primary);
            }
          }
        }

        svg {
          height: 24px;
          width: 24px;

          color: var(--text);
        }
      }
    }

    div {
      img {
        width: 48px;
        height: 48px;
        filter: invert(100%);
      }

      margin-left: 8px;
    }

    nav {
      display: flex;
      align-items: center;
      flex-direction: column;

      width: 100%;

      ul {
        margin-top: 4px;
        width: 100%;
        text-align: left;

        display: flex;
        flex-direction: column;

        gap: 4px;

        a {
          color: var(--text);
          padding: 16px 20px;
          border-radius: 8px 0 0 8px;

          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 16px;

          transition: background-color 0.3s;

          &:hover {
            background-color: var(--accent);

            svg {
              path {
                color: var(--secondary);
              }
            }
          }

          &.active {
            background-color: var(--primary);
            border-radius: 0 8px 8px 0;
            color: var(--secondary);

            svg {
              path {
                color: var(--secondary);
              }
            }
          }

          p {
            animation: ${slideFromRight} 0.5s;
          }

          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
}

aside {
  width: 100%;
  height: 100%;
}
`;
