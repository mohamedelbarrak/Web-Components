# My Media Player
Welcome to My Media Player, a web application that provides a customizable music visualizer and a set of audio disque controls. This project is built using web components, allowing you to easily integrate and customize different audio components in your web pages.

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

Audio Disque Component
````html
<my-disque audio-path="./assets/audio/RapTrap1.mp3"></my-disque>
````
The my-disque component represents a record player with audio controls. You can customize the appearance and behavior by modifying the styles and scripts in the my-disque.js file.

## Music Visualizer Component
Play Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/40d36350-c5d9-4aa7-91e9-2b37b101b08f)

Function: Initiates the playback of the audio.
Pause Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/9d021f1b-3e82-43c0-a22d-7706b4fd6a78)

Function: Pauses the currently playing audio.
Stop Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/c5b6c034-f481-4fc7-b9ec-00895bb6c7c4)

Function: Stops the audio playback and resets the current time to the beginning.
Skip Backward Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/d68170e7-99ee-4dd4-9e51-97ad3c42f931)

Function: Skips the audio playback backward by 5 seconds.
Skip Forward Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/e10aa27c-e856-48bd-8e24-588f88f6fa01)

Function: Skips the audio playback forward by 5 seconds.
Mute Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/56f75b3e-4d2a-40ba-a20c-7d6a601c7e46)

Function: Toggles the mute state of the audio. When muted, the icon changes to High Volume Icon.
Decrease Volume Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/141e1835-099c-48dd-a021-1394b9e75812)

Function: Decreases the audio volume by 0.1.
Increase Volume Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/dd008746-739c-47d1-9a51-5169c2208569)

Function: Increases the audio volume by 0.1.
Volume Control Slider
Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/f46322a6-44bb-409e-a23e-cae3902e5762)
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/75656288-8492-4718-b61f-be767e8a61ac)

Function: Allows manual adjustment of the audio volume using a slider.
Switch Button

Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/f251855c-3a6b-47cc-99f0-e5896255b91c)

Function: Toggles the visibility of the my-balance components based on the state of the switch.
Equalizer Knobs
Icon: ![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/a9be86af-792f-4d0f-91f4-30b2bb4a8539)

Functions: Adjust the gain for specific frequency bands (60 Hz, 170 Hz, 350 Hz, 1000 Hz, 3500 Hz, 10000 Hz).
Balance Knobs
Icon: ![Uploading image.png…]()

Functions: Adjust the balance and volume controls for the audio.

## Audio Disque (my-disque) Component

## Customization
Styles: Customize the appearance of the visualizer and disque components by modifying the CSS styles in the music-visualizer-component.js and my-disque.js files.

Functionality: Adjust the audio processing and control logic by modifying the JavaScript code in the music-visualizer-component.js and my-disque.js files.

## Dependencies
Bootstrap Icons

WebAudioControls

## Acknowledgments
The visualizer component uses inspiration from various online resources and tutorials on web audio visualization.
Feel free to explore and enhance this media player for your specific needs. If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request. Happy coding!
