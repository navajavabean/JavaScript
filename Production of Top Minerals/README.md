# Mineral Production & Reserves Visualization

## How to Run the Project

1. Install **Live Server** extension in VS Code.
2. Open **index.html** in VS Code.
3. Right-click on it and select **Run with Live Server**.
4. The project will open in your web browser.

This project is for **Langara College Computer Science 4260 - Assignment #2**.  
It visualizes mineral production and reserves using **D3.js**.

### Features

- **Semicircles** show production (top) and reserves (bottom).
- **Legend filter** to toggle continents.
- **Hover tooltip** for extra details.
- **Canada highlight** if it appears in the dataset.
- **Proper number formatting** for production and reserves.
- **Top 8 producers per mineral** shown.
- **Alphabetically ordered minerals** and **descending producers** by production.
- **Optimized rendering** using D3’s enter-update-exit pattern.

### Improvements

- X-axis labels are only at the top.
- Grid lines appear between rows instead of through the center.
- Some spacing and layout adjustments needed.
- The code could be modified to allow 6 minerals or fewer producers.

## File Structure

- `index.html` → Main file
- `style.css` → Styles for layout and charts
- `main.js` → Loads data, handles interactions
- `chart.js` → Renders the visualization
- `data/minerals.csv` → Dataset

## How to Modify

To change the number of minerals or producers:

- **For minerals**: Edit `mineralCategories` in `main.js`
- **For producers**: Change `.slice(0, 8)` in `getFilteredData()` function

## Data Sources

- **The Globe and Mail**  
- **USGS Reports**

## Other Resources Used

- [UBC InfoVis Course Materials](https://github.com/UBC-InfoVis/447-materials/blob/22Jan/programming-assignments/skeletons/p1/assignment.md)
- [D3.js Event Handling](https://www.tutorialsteacher.com/d3js/event-handling-in-d3js)
- [D3.js Debugging (FreeCodeCamp)](https://forum.freecodecamp.org/t/d3-js-bar-chart-stuck-in-the-upside-down/251102)
- [D3.js Crash Course (YouTube)](https://www.youtube.com/watch?v=uyPYxx-WGxc)
- [D3.js Basics (YouTube)](https://www.youtube.com/watch?v=aHJCt2adSWA)
- My previous assignment 1

## Notes

If the visualization doesn’t load:

1. Check if **Live Server** is running.
2. Open the browser console (**F12 or Right click and select "Inspect" → Console**) to check for errors.
3. Reload the page.

