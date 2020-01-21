# Data Lineaege Visualization Application

This tool is created using ReactJS.


## How does it work?

### * Suppose we have the following lineage data (csv format) :

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im9.png)

Where data-flow is from \[from1, from2, from3, from4, from5] -> \[to1, to2, to3, to4, to5]
For example, the data flow from \[A, B, C, D, E] to {\[AA, BB, CC, DD, EE], \[L, M, N, O, P], ..., \[I, D, K, F, E]} and now from, say, \[I, D, K, F, E] the data flows to \[EE, TT, UU, II, E].


### * The basic UI

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im1.png)


### * Uploading the data

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im2.png)


### * Upload Complete

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im3.png)


### * Filling the fields (info about the root node whose lineage has to be visualized)

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im4.png)


### * The root node

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im5.png)

(Left : Node, Right : Index that stores the classification of a field)
(Show More : Shows the next n hops, Show All : Shows all hops at once)


### * All nodes

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im7.png)


### * On clicking a node, all its connections changes color

![alt text](https://github.com/SuperThinking/Data_Lineage_Visualization-Application/blob/master/screenshots/im8.png)




This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
