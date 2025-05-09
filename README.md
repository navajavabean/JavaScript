# Top Mineral Producers and Reserves – Made Visual
### ***This is one of my favourite interactive visualizations I’ve built. You can check it out in action in the GIF below:***

#### What You're Looking At

This project visualizes the production (top semicircle) and estimated reserves (bottom semicircle) of five key minerals used in lithium-ion batteries — things like lithium, cobalt, graphite, nickel, and manganese. Each chart shows the top 8 producing countries, with data from 2022.
![ezgif com-crop-2](https://github.com/user-attachments/assets/93d9eb21-dc0e-4bc7-a083-5a79c9c6159d)

#### Key Features:

Tooltip on hover – Shows exact production and reserve values (in thousands or millions of tonnes).
Canada highlight – Any time Canada is in the top 8, it gets a subtle grey box around it so it’s easy to spot.
Continent filter – Want to hide all of Asia or Europe? Just click on a continent in the legend. You can toggle multiple continents on/off and click again to bring them back.
Clean number formatting – All values are human-readable with commas (no raw large numbers).
Color-coded by continent – Makes it easy to visually group countries.

#### The Goal was to make this static illustration in D3. This was a part of an article called Batteries Required by Matthew McClearn (Globe and Mail, Dec 16, 2023)
![Screen Shot 2025-05-09 at 1 17 34 PM](https://github.com/user-attachments/assets/2457e9c7-6ee6-4004-adfd-cc0959626f33)


#### How to Run This

1. Open the project folder in VS Code
2. Install the Live Server extension (if you haven’t already)
3. Right-click on index.html and select "Run with Live Server"
4. It’ll open right in your browser, fully interactive

#### What's Inside

index.html — The main webpage
css/style.css — Layout and chart styling
js/main.js — Controls loading, filtering, and interactions
js/chart.js — Handles the D3 chart drawing
data/minerals.csv — The dataset I used, based on USGS and Globe and Mail reporting

#### What I Learned and Loved

Working on this project taught me a lot — not just about coding, but about how to make data actually feel interesting.

One thing I really loved was turning raw numbers into something visual and interactive. At first, it was just a CSV file full of mineral production and reserve values. But once I started designing how people could explore it — with circles, colors, tooltips, and filters — it felt like the data came to life.

I had a lot of fun adding small touches that made a big difference:

Showing Canada with a little grey box so it’s easy to find.
Making it so you can click on continents to hide or bring back data — kind of like turning layers on and off.
Making sure the numbers were readable and looked clean, not just "techy."
I also learned how to use D3.js to update everything smoothly when users interact with the page — that’s the part behind the scenes that makes it all feel responsive and fast.

Overall, what I took away from this was how good design can make data easier to explore — and more fun, even for someone who’s not into charts or numbers.
