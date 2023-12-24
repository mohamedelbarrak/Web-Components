# My Media Player
Welcome to My Media Player, a web application that provides a customizable music visualizer and a set of audio balance controls. This project is built using web components, allowing you to easily integrate and customize different audio components in your web pages.

## Features
Music Visualizer: The music visualizer component creates a dynamic visual representation of the audio being played. It displays colorful bars that move in sync with the audio frequency.

Audio Disque Controls: The audio disque component, allows you to control various audio parameters such as volume, play and pause the audio.

## Getting Started
Clone the repository to your local machine:
[git clone https://github.com/my-media-player.git](https://github.com/mohamedelbarrak/Web-Components.git)
Open the index.html file in your preferred web browser to see the media player in action.

## Usage
Music Visualizer Component
````html
<music-visualizer-component class="gradient-border" id="box"></music-visualizer-component>
````
This component creates a visualizer that reacts to the audio being played. You can customize its appearance by modifying the styles in the music-visualizer-component.js file.

Audio Balance Component
````html
<my-balance audio-path="./assets/audio/RapTrap1.mp3"></my-balance>
````
The my-balance component represents a record player with audio controls. You can customize the appearance and behavior by modifying the styles and scripts in the my-balance.js file.

## Customization
Styles: Customize the appearance of the visualizer and balance components by modifying the CSS styles in the music-visualizer-component.js and my-balance.js files.

Functionality: Adjust the audio processing and control logic by modifying the JavaScript code in the music-visualizer-component.js and my-balance.js files.

## Dependencies
Bootstrap Icons

WebAudioControls

## Acknowledgments
The visualizer component uses inspiration from various online resources and tutorials on web audio visualization.
Feel free to explore and enhance this media player for your specific needs. If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request. Happy coding!
