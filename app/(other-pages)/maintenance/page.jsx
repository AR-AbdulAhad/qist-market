export const metadata = {
  title: "Qist Market | Site Maintenance",
  robots: { index: true, follow: true },
};

const Maintenance = () => {
  return (
    <>
      <div style={styles.container}>

        <h1 style={styles.title}>We'll Be Back Soon!</h1>
        
        <p style={styles.subtitle}>
          Our platform is currently undergoing scheduled maintenance.
        </p>
        
        <p style={styles.message}>
          We apologize for the inconvenience and appreciate your patience. This temporary downtime allows us to serve you better in the long run.
        </p>

      </div>
    </>
  );
};

export default Maintenance;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#505050',
    textAlign: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  title: {
    fontSize: '3rem',
    color: '#ff3d3d',
    marginBottom: '15px',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '1.4rem',
    marginBottom: '25px',
    fontWeight: '400',
    maxWidth: '700px',
  },
  message: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    maxWidth: '650px',
    marginBottom: '40px',
    color: '#505050',
  },
};