import { getTenantById,getResourceByName } from "./authApi";

export const canAccessResource = async (resourceName, userRoles) => {
  try {
    // Fetch tenant information
    const tenantResponse = await getTenantById();
    if (!tenantResponse) {
      return false;
    }

    const tenant = tenantResponse.data;
    const abbreviatedName = tenant.abbreviatedName;

    // Fetch the resource by name
    const resourceResponse = await getResourceByName(resourceName);
    const resource = resourceResponse.data;

    // Check if the resource is active
    if (resource.status !== "ACTIVE") {
      return false;
    }

    // Construct required roles
    const requiredRoles = resource.requiredRoles.map(
      (role) => `${abbreviatedName.toLowerCase()}_${role}`
    );

    // Check if user has access
    return requiredRoles.some((role) => userRoles.includes(role));
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return false;
    }

    return false;
  }
};
