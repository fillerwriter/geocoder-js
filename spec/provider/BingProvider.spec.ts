import GeocoderJS from "GeocoderJS";
import { BingGeocoded, BingProvider } from "provider";
import ExternalLoader from "ExternalLoader";
import AdminLevel from "AdminLevel";
import setupPolly, { cleanRecording } from "../setupPolly";

describe("Bing Geocoder Provider", () => {
  const pollyContext = setupPolly();

  beforeEach(() => {
    cleanRecording(pollyContext);
  });

  afterEach(async () => {
    await pollyContext.polly.flush();
  });

  it("expects API Key to be required on initiation", () => {
    expect(() => new BingProvider(new ExternalLoader())).toThrowError(
      Error,
      'An API key is required for the Bing provider. Please add it in the "apiKey" option.'
    );
  });

  it("expects to not support IP geolocation", () => {
    const provider = GeocoderJS.createGeocoder({
      provider: "bing",
      useSsl: true,
      apiKey: "api_key",
    });

    expect(() =>
      provider?.geocode(
        "66.147.244.214",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      )
    ).toThrowError(
      Error,
      "The Bing provider does not support IP geolocation, only location geocoding."
    );
  });

  it("receives correct geocoding results", (done) => {
    const provider = GeocoderJS.createGeocoder({
      provider: "bing",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geocode(
      "1600 Pennsylvania Ave, Washington, DC",
      (results: BingGeocoded[]) => {
        const geocoded = results[0];

        expect(geocoded).toBeDefined();
        expect(geocoded.getCoordinates()).toEqual({
          latitude: 38.897639,
          longitude: -77.036475,
        });
        expect(geocoded.getBounds()).toEqual({
          latitudeSW: 38.89377628242932,
          longitudeSW: -77.04309226192471,
          latitudeNE: 38.901501717570675,
          longitudeNE: -77.02985773807528,
        });
        expect(geocoded.getFormattedAddress()).toEqual(
          "1600 Pennsylvania Ave NW, Washington, DC 20006"
        );
        expect(geocoded.getStreetNumber()).toEqual(undefined);
        expect(geocoded.getStreetName()).toEqual("1600 Pennsylvania Ave NW");
        expect(geocoded.getSubLocality()).toEqual(undefined);
        expect(geocoded.getLocality()).toEqual("Washington");
        expect(geocoded.getPostalCode()).toEqual("20006");
        expect(geocoded.getRegion()).toEqual("DC");
        expect(geocoded.getAdminLevels()).toEqual([
          AdminLevel.create({
            level: 1,
            name: "DC",
          }),
          AdminLevel.create({
            level: 2,
            name: "City of Washington",
          }),
        ]);
        expect(geocoded.getCountry()).toEqual("United States");
        expect(geocoded.getCountryCode()).toEqual("US");
        expect(geocoded.getAttribution()).toEqual(
          "Copyright © 2020 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation."
        );
        expect(geocoded.getPrecision()).toEqual("Medium");

        done();
      }
    );
  });

  it("receives correct geodecoding results", (done) => {
    const provider = GeocoderJS.createGeocoder({
      provider: "bing",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geodecode(48.8631507, 2.388911, (results: BingGeocoded[]) => {
      const geocoded = results[0];

      expect(geocoded).toBeDefined();
      expect(geocoded.getCoordinates()).toEqual({
        latitude: 48.8631093,
        longitude: 2.3887809,
      });
      expect(geocoded.getBounds()).toEqual({
        latitudeSW: 48.85924658242932,
        longitudeSW: 2.380952653445271,
        latitudeNE: 48.866972017570674,
        longitudeNE: 2.396609146554729,
      });
      expect(geocoded.getFormattedAddress()).toEqual(
        "8 Avenue Gambetta, 75020 Paris"
      );
      expect(geocoded.getStreetNumber()).toEqual(undefined);
      expect(geocoded.getStreetName()).toEqual("8 Avenue Gambetta");
      expect(geocoded.getSubLocality()).toEqual(undefined);
      expect(geocoded.getLocality()).toEqual("Paris");
      expect(geocoded.getPostalCode()).toEqual("75020");
      expect(geocoded.getRegion()).toEqual("Île-de-France");
      expect(geocoded.getAdminLevels()).toEqual([
        AdminLevel.create({
          level: 1,
          name: "Île-de-France",
        }),
        AdminLevel.create({
          level: 2,
          name: "Paris",
        }),
      ]);
      expect(geocoded.getCountry()).toEqual("France");
      expect(geocoded.getCountryCode()).toEqual("FR");
      expect(geocoded.getAttribution()).toEqual(
        "Copyright © 2020 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation."
      );
      expect(geocoded.getPrecision()).toEqual("High");

      done();
    });
  });

  it("receives error when the API key is bad", (done) => {
    const provider = GeocoderJS.createGeocoder({
      provider: "bing",
      useSsl: true,
      apiKey: "api_key",
    });

    provider?.geocode(
      "1600 Pennsylvania Ave, Washington, DC",
      () => {
        done();
      },
      (error) => {
        expect(error.message).toEqual(
          "Access was denied. You may have entered your credentials incorrectly, or you might not have access to the requested resource or operation."
        );
        done();
      }
    );
  });
});
