# Redesign for Responsiveness

> This documents the do's and don't for responsive design

## GitHub
- Create a PR using [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) style titles.
  - For most of the responsive design it should be considered a `style` change
- When opening a PR please provide a screenshot of the before and after of the component that is changed.
  - These components should be size based changes and should not be stylistic changes (i.e: only change size not colour)

## SCSS
Prometheus Team will create a global stylesheet as well as variables to be used. 

- When developing if there are commented out code blocks please make sure to just remove the commented out code
- When creating new class names and id's please make sure to use hyphens when separating
- Try not to do inline scss when possible and just add the new class names and id's to a scss file
- If it is a bootstrap or global style try not to change it as much as possible
  - If this is not possible please make sure to just create a new style for responsiveness
- When global stylesheet is provided instead of using hexcode for colour please use colour variable
  - i.e: instead of using `#ffffff` use `var(--white)` (or something similar may not be `--white`)
- Use scss shorthand when possible
  - i.e: use `margin-top: 5px;` instead of `margin: 5px, 0, 0 ,0;`
- Use more relative units instead of static units
  - i.e: try to minimize the use of `px` in favour of `em, rem, %, vw, vh`
- Avoid overwriting or undoing styles