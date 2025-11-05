import React from 'react';

const MapEmbed = React.memo(({ iframeHtml }) => {
  if (!iframeHtml) {
    return <div className="text-center py-12">No map available</div>;
  }

  return (
    <div
      style={{ borderRadius: 8, width: '100%' }}
      dangerouslySetInnerHTML={{ __html: iframeHtml }}
    />
  );
});

MapEmbed.displayName = 'MapEmbed';

export default MapEmbed;