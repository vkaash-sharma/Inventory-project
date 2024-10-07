import React from 'react';
import CustomTooltip from '../CustomToolTip/CustomToolTip';

// Utility function to generate color from a string
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  
  return color;
}

// Utility function to extract initials from a name
function stringAvatar(name) {
  const nameArray = name.split(' ');
  const initials = nameArray.length > 1 
    ? `${nameArray[0][0]}${nameArray[1][0]}`
    : `${nameArray[0][0]}${nameArray[0][1] || ''}`;
  return {
    backgroundColor: stringToColor(name),
    initials: initials.toUpperCase(),
  };
}

// Avatar component
function Avatar({ name }) {
  const { backgroundColor, initials } = stringAvatar(name);

  const avatarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor,
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  return <div style={avatarStyle}>{initials}</div>;
}

// App component to display avatars
export default function CustomAvatar({value}) {
  console.log("🚀 ~ CustomAvatar ~ value:", value)
  return (
    <CustomTooltip tooltipData={value}>
    <div style={{ display: 'flex', gap: '16px' }} >
      <Avatar name={value} />
    </div>
    </CustomTooltip>
  );
}