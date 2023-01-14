export interface Specification {
  _id: Id;
  Product: Product;
  Date: Date2;
  Design: Design;
  Inside: Inside;
  Display: Display;
  No: No;
  Camera: Camera;
  Rank: Rank;
  Description: Description;
  Image: Image;
}

interface Image {
  Front?: any;
  RawFrontBack?: any;
  RawBack?: any;
  Back?: any;
  "Back Size"?: any;
  RawFront?: any;
  "Front Size"?: any;
}

interface Description {
  XXIII?: any;
  IX?: any;
  XI?: any;
  XII?: any;
  VIII?: any;
  XIV?: any;
  XXV?: any;
  XXIV?: any;
  X?: any;
  I?: any;
  XXII?: any;
  IV?: any;
  XIX?: any;
  XVIII?: any;
  VI?: any;
  XXI?: any;
  XIII?: any;
  III?: any;
  V?: any;
  VII?: any;
  XV?: any;
  XVI?: any;
  II?: any;
  XX?: any;
  XVII?: any;
}

interface Rank {
  GPU?: any;
  Battery?: any;
  RAM?: any;
  Price?: any;
  CPU?: any;
  Display?: any;
  "Back Camera I"?: any;
  "Front Camera I"?: any;
  Storage: Storage2;
}

interface Storage2 {
  $numberDouble: string;
}

interface Camera {
  "Back Camera": BackCamera;
  "Back Camera II": BackCameraII;
  "Back Camera III": BackCameraIII;
  "Back Camera IV": BackCameraIV;
  "Back Camera V": BackCameraV;
  "Front Camera": FrontCamera;
  "Front Camera II": FrontCameraII;
  "Front Camera III": BackCameraIV;
}

interface FrontCameraII {
  Resolution: string;
  Sensor: string;
  "Pixel Size": string;
}

interface FrontCamera {
  Resolution: string;
  Sensor: string;
  "Pixel Size": string;
  "Video Format": string;
  Module: string;
  "Video Resolution": string;
  "Aperture (W)": string;
  Features: string;
  "Resolution (H x W)": string;
  "Image Format": string;
}

interface BackCameraV {
  Sensor: string;
  Focus: string;
}

interface BackCameraIV {
  Sensor: string;
}

interface BackCameraIII {
  Sensor: string;
  "Pixel Size": string;
}

interface BackCameraII {
  Features: string;
  Sensor: string;
  Resolution: string;
  "Aperture (W)": string;
  "Pixel Size": string;
}

interface BackCamera {
  "Image Format": string;
  Focus: string;
  Sensor: string;
  "Sensor Format": string;
  Zoom: string;
  "Video Resolution": string;
  "Video Format": string;
  Flash: string;
  "Aperture (W)": string;
  Resolution: string;
  "Pixel Size": string;
  Features: string;
  "Resolution (H x W)": string;
}

interface No {
  "SIM Frequencies": string;
  "SIM II Frequencies": string;
  Expansion: string;
  "FM Radio": string;
  GPS: string;
}

interface Display {
  Width: string;
  "Resolution (H x W)": string;
  "Color Depth": string;
  Type: string;
  "Screen to Body Ratio": string;
  Height: string;
  Glass: string;
  "Refresh Rate": string;
  Subpixels: string;
  "Number of Colors": string;
  Diagonal: string;
  Illumination: string;
  "Pixel Size": string;
  "Dynamic Range": string;
  "Bezel Width": string;
  "LCD Mode": string;
  "Pixel Density": string;
  "Touch Point(s)": string;
  "Touch screen Type": string;
}

interface Inside {
  Software: Software;
  Processor: Processor;
  RAM: RAM;
  Storage: Storage;
  Audio: Audio;
  Cellular: Cellular;
  "Port(s)": Ports;
  Wireless: Wireless;
  Battery: Battery;
  "Sensor(s)": AdditionalFeatures;
  Location: AdditionalFeatures;
}

interface Battery {
  "Charging Power": string;
  Type: string;
  Voltage: string;
  "Cell I": string;
  Energy: string;
  Life: string;
  Capacity: string;
  "Cell II": string;
  Current: string;
  Style?: any;
}

interface Wireless {
  "Bluetooth Profiles": string;
  "WiFi Feature(s)": string;
  "Bluetooth Version": string;
  WiFi: string;
  "Experience(s)": string;
}

interface Ports {
  "USB Feature(s)": string;
  "USB Type": string;
  "USB Version": string;
}

interface Cellular {
  "SIM Mobile Data": string;
  Generation?: any;
  "SIM Type"?: any;
}

interface Audio {
  "AV Out": string;
  "AV Resolution": string;
  Channel: string;
  "Microphone(s)": string;
  Output: string;
}

interface Storage {
  Type: string;
  "Capacity I": string;
  Capacity: string;
}

interface RAM {
  Type: string;
  "Capacity I": string;
  "Clock Speed"?: any;
  Capacity?: any;
}

interface Processor {
  CPU: string;
  "CPU Clock Speed": string;
  "GPU Clock Speed": string;
  GPU: string;
}

interface Software {
  OS: string;
  "OS Version": string;
  "Additional Features": string;
}

interface Design {
  Body: Body;
  Keyboard: Keyboard;
  "Additional Features": AdditionalFeatures;
}

interface AdditionalFeatures {
  Present: string;
}

interface Keyboard {
  Design: string;
  Backlight: string;
}

interface Body {
  Weight: string;
  Thickness: string;
  Height: string;
  Width: string;
  "IP Rating": string;
  "Color(s)": string;
}

interface Date2 {
  Released: string;
  Announced: string;
  Added: string;
  Scraped: Scraped;
}

interface Scraped {
  $date: Date;
}

interface Date {
  $numberLong: string;
}

interface Product {
  URL: string;
  "Image URL": string;
  Brand: string;
  RawModel: string;
  Manufacturer: string;
  Designer: string;
  Alias: string;
  "OEM ID": string;
  Country: string;
  Region: string;
  Model: string;
  Source: string;
  Category: string;
  Version: string;
  "SIM Type"?: any;
}

interface Id {
  $oid: string;
}
