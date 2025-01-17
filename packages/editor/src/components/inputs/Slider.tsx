// @ts-nocheck
import RCSlider from 'rc-slider/es/Slider'
import React from 'react'
import { createGlobalStyle } from 'styled-components'

/**
 * @author Robert Long
 */
const SliderGlobalStyles = createGlobalStyle`
  .rc-slider {
    display: flex;
    flex: 1;
    height: 1px;
    margin-right: 28px;
    position: relative;
    border-radius: 2px;
  }

  .rc-slider-track {
    position: absolute;
    height: 2px;
    background-color: var(--purpleColor);
    border-radius: 2px;
  }

  .rc-slider-rail {
    position: absolute;
    width: calc(100% + 16px);
    height: 2px;
    background-color: var(--border);
    border-radius: 2px;
  }

  .rc-slider-handle {
    position: absolute;
    margin-top: -5px;
    width: 12px;
    height: 12px;
    cursor: pointer;
    border-radius: 50%;
    border: solid 2px var(--white);
    background-color: var(--border);
    touch-action: pan-x;
    outline: none;

      &:hover {
        border: solid 2px var(--purpleColor);
        background-color: var(--white);
      }

      &:active {
        border:  2px solid var(--purpleColor);
        background-color: var(--white);
      }
    }

  .rc-slider-disabled {
    background-color: var(--panel2);
    border-radius: 2px;

    .rc-slider-track {
      background-color: var(--panel2);
    }

    .rc-slider-handle, .rc-slider-dot {
      border-color: var(--panel2);
      box-shadow: none;
      background-color: var(--toolbar);
      cursor: not-allowed;
    }

    .rc-slider-mark-text, .rc-slider-dot {
      cursor: not-allowed!important;
    }
  }
`
/**
 *
 * @author Robert Long
 * @param props
 * @returns
 */
export default function Slider(props) {
  return (
    <>
      <RCSlider {...props} />
      <SliderGlobalStyles />
    </>
  )
}
