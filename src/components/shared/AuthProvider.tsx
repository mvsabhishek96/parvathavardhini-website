        if (userDoc.exists()) {
          const customData = userDoc.data();
          console.log('customData from Firestore:', customData);
          for (const key in customData) {
            console.log(`Key: ${key}, Value: ${customData[key]}`);
          }
          setUser({
            ...firebaseUser,
            name: customData.name,
            mobile: customData.mobile,
            isMaster: customData['isMaster'], // Directly assign without fallback
          });