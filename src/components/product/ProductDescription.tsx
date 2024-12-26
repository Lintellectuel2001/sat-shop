import React from 'react';

interface ProductDescriptionProps {
  description: string;
  downloadInfo?: {
    ironTvPro: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    ironTvMax: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    noxPro: {
      directLink: string;
      downloaderCode: string;
    };
  };
}

const ProductDescription = ({ description, downloadInfo }: ProductDescriptionProps) => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p className="text-lg text-accent whitespace-pre-line">{description}</p>
        
        {downloadInfo && (
          <>
            <h3 className="text-xl font-semibold mt-6">How to download the app:</h3>
            
            <h4 className="font-semibold mt-4">IRON TV PRO:</h4>
            <ul>
              {downloadInfo.ironTvPro.directLinks.map((link, index) => (
                <li key={index}>Direct link {index + 1}: <a href={link} className="text-primary hover:underline">{link}</a></li>
              ))}
              <li>Downloader codes: {downloadInfo.ironTvPro.downloaderCodes.join(' or ')}</li>
            </ul>

            <h4 className="font-semibold mt-4">IRON TV MAX (new design):</h4>
            <ul>
              {downloadInfo.ironTvMax.directLinks.map((link, index) => (
                <li key={index}>Direct link {index + 1}: <a href={link} className="text-primary hover:underline">{link}</a></li>
              ))}
              <li>Downloader codes: {downloadInfo.ironTvMax.downloaderCodes.join(' or ')}</li>
            </ul>

            <h4 className="font-semibold mt-4">NOX PRO:</h4>
            <ul>
              <li>Direct link: <a href={downloadInfo.noxPro.directLink} className="text-primary hover:underline">{downloadInfo.noxPro.directLink}</a></li>
              <li>Downloader code: {downloadInfo.noxPro.downloaderCode}</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">How to convert Iron code to Xtream or Smarter or M3u:</h3>
            <p>To convert Iron code to Xtream or Smarter or M3u you should contact us to get the user and password and url</p>

            <h3 className="text-xl font-semibold mt-6">How to use IRON IPTV on Apple devices:</h3>
            <p>First, convert the code to xtream, and install this app 247 IPTV Player or IPTV Smarter. After installing the app insert the user and password and the URL... that's all, enjoy!</p>

            <h3 className="text-xl font-semibold mt-6">Important:</h3>
            <ol className="list-decimal pl-5">
              <li>The supplier remains solely responsible for the content of his packages and the availability of the channels included in his offer.</li>
              <li>Some channels or bouquets may be temporarily unavailable, this is totally beyond our control</li>
              <li>No guarantee on the availability of services or packages during the subscription.</li>
              <li>The code is irreversibly linked with the Mac address of the first receiver that uses it.</li>
            </ol>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;