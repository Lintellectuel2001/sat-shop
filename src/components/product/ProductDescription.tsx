import React from 'react';

interface ProductDescriptionProps {
  description: string;
  downloadInfo?: {
    ironTvPro?: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    ironTvMax?: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    noxPro?: {
      directLink: string;
      downloaderCode: string;
    };
    atlasPro?: {
      directLink: string;
      downloaderCode: string;
    };
    atlasProMax?: {
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
            <h3 className="text-xl font-semibold mt-6">Comment télécharger l'application :</h3>
            
            {downloadInfo.ironTvPro && (
              <>
                <h4 className="font-semibold mt-4">IRON TV PRO :</h4>
                <ul>
                  {downloadInfo.ironTvPro.directLinks.map((link, index) => (
                    <li key={index}>Lien direct {index + 1} : <a href={link} className="text-primary hover:underline">{link}</a></li>
                  ))}
                  <li>Codes Downloader : {downloadInfo.ironTvPro.downloaderCodes.join(' ou ')}</li>
                </ul>
              </>
            )}

            {downloadInfo.ironTvMax && (
              <>
                <h4 className="font-semibold mt-4">IRON TV MAX (nouveau design) :</h4>
                <ul>
                  {downloadInfo.ironTvMax.directLinks.map((link, index) => (
                    <li key={index}>Lien direct {index + 1} : <a href={link} className="text-primary hover:underline">{link}</a></li>
                  ))}
                  <li>Codes Downloader : {downloadInfo.ironTvMax.downloaderCodes.join(' ou ')}</li>
                </ul>
              </>
            )}

            {downloadInfo.noxPro && (
              <>
                <h4 className="font-semibold mt-4">NOX PRO :</h4>
                <ul>
                  <li>Lien direct : <a href={downloadInfo.noxPro.directLink} className="text-primary hover:underline">{downloadInfo.noxPro.directLink}</a></li>
                  <li>Code Downloader : {downloadInfo.noxPro.downloaderCode}</li>
                </ul>
              </>
            )}

            {downloadInfo.atlasPro && (
              <>
                <h4 className="font-semibold mt-4">Atlas Pro :</h4>
                <ul>
                  <li>Lien direct : <a href={downloadInfo.atlasPro.directLink} className="text-primary hover:underline">{downloadInfo.atlasPro.directLink}</a></li>
                  <li>Code Downloader : {downloadInfo.atlasPro.downloaderCode}</li>
                </ul>
              </>
            )}

            {downloadInfo.atlasProMax && (
              <>
                <h4 className="font-semibold mt-4">Atlas Pro Max :</h4>
                <ul>
                  <li>Lien direct : <a href={downloadInfo.atlasProMax.directLink} className="text-primary hover:underline">{downloadInfo.atlasProMax.directLink}</a></li>
                  <li>Code Downloader : {downloadInfo.atlasProMax.downloaderCode}</li>
                </ul>
              </>
            )}

            {(downloadInfo.ironTvPro || downloadInfo.ironTvMax) && (
              <>
                <h3 className="text-xl font-semibold mt-6">Comment convertir le code Iron en Xtream, Smarter ou M3u :</h3>
                <p>Pour convertir le code Iron en Xtream, Smarter ou M3u, vous devez nous contacter pour obtenir l'utilisateur, le mot de passe et l'URL</p>

                <h3 className="text-xl font-semibold mt-6">Comment utiliser IRON IPTV sur les appareils Apple :</h3>
                <p>D'abord, convertissez le code en xtream, puis installez l'application 247 IPTV Player ou IPTV Smarter. Après l'installation, insérez l'utilisateur, le mot de passe et l'URL... c'est tout, profitez !</p>
              </>
            )}

            <h3 className="text-xl font-semibold mt-6">Important :</h3>
            <ol className="list-decimal pl-5">
              <li>Le fournisseur reste seul responsable du contenu de ses bouquets et de la disponibilité des chaînes incluses dans son offre.</li>
              <li>Certaines chaînes ou bouquets peuvent être temporairement indisponibles, ceci est totalement hors de notre contrôle</li>
              <li>Aucune garantie sur la disponibilité des services ou des bouquets pendant l'abonnement.</li>
              <li>Le code est irréversiblement lié à l'adresse Mac du premier récepteur qui l'utilise.</li>
            </ol>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;