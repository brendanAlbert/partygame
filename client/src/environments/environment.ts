// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const host = 'http://192.168.0.12';
const host = 'http://34.215.175.241';
const port = '5000';

export const environment = {
  production: false,
  trivia_api_endpoint: `${host}:${port}/trivia`,
  msgHubUrl: `${host}:${port}/msghub`,
  hackers_api_endpoint: `${host}:${port}/hackers`,
  drawHubUrl: `${host}:${port}/drawhub`,
  image_upload_endpoint: `${host}:${port}/draw/images/upload`,
  avatar_copy_endpoint: `${host}:${port}/draw/images/copy`,
  player_image_url: `${host}:${port}/draw/images/`,
  prompt_image_upload_url: `${host}:${port}/draw/images/prompts/upload`,
  get_prompt_image_url: `${host}:${port}/draw/images/prompts/`,
  //   players_draw_endpoint: `${host}:${port}/draw/players`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
