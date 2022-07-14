import styled, { css } from 'styled-components'
export const DarkBackground = styled.div`
display: none;
position: fixed;
z-index: 999;
left: 0;
top: 0;
width: 100%;
height: 100%;
overflow: auto;
background-color: rgb(0, 0, 0); /* Fallback color */
background-color: rgba(222, 222, 225, 0.4); /* Black w/ opacity */

${props =>
  props.disappear &&
  css`
    display: block; /* show */
  `}
`