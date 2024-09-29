# Voiceboard

Whiteboarding and diagramming is a critical component to sharing and conveying ideas, especially in an educational setting. However, not everyone has the ability to draw or write legibly, or even write at all. Voiceboard is a web application that allows users to articulate and visualize their thoughts with speech recognition to diagramming technology. Users can speak their ideas and have them translated into text, which can then be converted into diagrams and flowcharts. This application is designed to be accessible to all users, regardless of their ability to write or draw, and make it easier for all people to share their ideas equally.

## Inspiration
As software engineers, our team has become extremely dependent on white-boarding technologies to help us convey ideas to each other. Without these tools, we realized that collaboration would be much harder, and realized that not everyone is able to benefit from the beauty of collaborative diagramming. Whether it be a physical disability or a disdain for technology, Voiceboard is meant to be accessible for everyone.

## What it does
Voiceboard listens to incoming speech and sends the requested drawing in plain text to Google Gemini. With some clever optimizations and prompt engineering, we convert the text into Mermaid, a syntax for creating diagrams.

## How we built it
We utilized built-in browser Speech Recognition APIs to help detect speech client side. Then, we sent filtered transcript over to our server once the wake phrase was detected, and generated Mermaid markup to demonstrate the graphs using Google Gemini. We also made sure to send the current state of the whiteboard to allow for modifications, and added other usability commands to the drawing screen. Lastly, we filtered the Mermaid code block, made necessary refinements, and mapped it into an Excalidraw embed.

## Challenges we ran into
This was our first time working with Speech Recognition and Diagramming technologies, so it was a bit of a challenge to find the right technologies. Initially, we attempted to create an audio stream encoding to a Google Cloud Speech Recognition service, but the technical complexity of constant audio upstream was a headache in itself. As for Mermaid, none of us had any experience working with it. We struggled to find a good Mermaid render engine for React, and had to settle with Excalidraw, which provided lots of good ease of use options but only supported a subset of Mermaid elements.

## Accomplishments that we're proud of
We're proud of how seamless the voice recognition is. We spent a lot of time for making the recognition flow smooth rather than always listening and jumbling up the board. We are also happy that we could provide Gemini the context of the current board and provide a conditional flow that lets users modify boards after they are created as well.

## What we learned
We learned a lot about Mermaid and the complexity behind syntax parsing, as well as the complexity of Speech to Text technology. We hope to use these new skills in future projects!

## What's next for Voiceboard
We want to look more into Mermaid rendering to make the actual processing of the ideas even better. If time allows it, two avenues we would like to explore are our own rendering engine for the Mermaid code-block or perhaps even a custom trained model on Mermaid.