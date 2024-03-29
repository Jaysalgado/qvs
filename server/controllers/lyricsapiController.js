const axios = require('axios');

// stab rabbit api key
const apiKey = '595bd70d43ffcfc732dcc8a9855d0589'; // Replace with your actual API key
const baseUrl = 'https://api.musixmatch.com/ws/1.1/';
const endpoint = 'matcher.lyrics.get';
// const topSongsEndPoint = 'chart.tracks.get';

const lyricsapiController = {};
let count = 0;

lyricsapiController.getTopSongs = async () => {
  try {
    // const params = {
    //   apiKey: '595bd70d43ffcfc732dcc8a9855d0589',
    //   chart_name: 'top',
    //   page: 1,
    //   page_size: 5,
    //   f_has_lyrics: 1,
    //   country: 'us',
    // };
    console.log('in lyricscontroller.getTopSongs');
    const resultUrl =
      'https://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey=595bd70d43ffcfc732dcc8a9855d0589&chart_name=top&page=1&page_size=10&f_has_lyrics=1&country=US';
    let response = await axios.get(resultUrl);
    if (response.status === 200) {
      const ran_num = Math.floor(Math.random() * 9);
      console.log(ran_num);
      if (count === 10) {
        count = 0;
      }
      const artist_name =
        response.data.message.body.track_list[count].track.artist_name;
      const song_name =
        response.data.message.body.track_list[count].track.track_name;
      // console.log(artist_name, ' ', song_name);
      console.log(artist_name, song_name, 'console logging artist and song');
      const result_from_method = await lyricsapiController.getLyrics(
        artist_name,
        song_name
      );
      console.log(result_from_method, 'result_from_method');
      count++;
      return result_from_method;
    }
  } catch (error) {
    console.error('An error occurred in getTopSongs:', error.message);
  }
};

lyricsapiController.getTopSongs();

lyricsapiController.getLyrics = async (artist_name, song_name) => {
  try {
    // const { songname, artist, trackId } = req.body;
    const params = {
      q_track: song_name,
      q_artist: artist_name,
      apikey: apiKey,
    };
    console.log('in lyrics controller getLyrics function');
    const response = await axios.get(baseUrl + endpoint, { params });

    if (response.status === 200) {
      const lyrics = response.data.message;
      // console.log(lyrics, 'lyrics');
      if (lyrics) {
        const lyricsBody = {
          lyrics: lyrics.body.lyrics.lyrics_body,
          song_name: song_name,
        };

        //console.log(lyricsBody)
        // console.log('Lyrics:\n', lyricsBody);
        // console.log(lyricsBody);
        return lyricsBody;
        // res.locals.artist = artist;
        // res.locals.songname = songname;
        // res.locals.trackId = trackId;
        // return next();
      } else {
        console.log('No lyrics found');
        throw new Error('No lyrics found');
      }
    } else {
      console.log('An error occurred:', response.status);
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('An error occurred in getLyrics:', error.message);
    // return next(error);
  }
};

module.exports = lyricsapiController;
