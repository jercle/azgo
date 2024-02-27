az acr repository show-manifests -n ${acrRegistry} --repository ${appName}


az acr manifest list -r ${acrRegistry} -n ${appName}
# /subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourceGroups/dmz-nonprod-dev-rg/providers/Microsoft.ContainerRegistry/registries/dmznonproddevacr01?api-version=2021-08-01-preview

node ../funcs/az/


getsubAssessments(
  opts,
  new (require("@azure/identity").DefaultAzureCredential)()
).then((res) => console.log(res))


https://github.com/aquasecurity/trivy/releases/tag/v0.18.3
https://github.com/aquasecurity/trivy/releases/latest


curl -s https://api.github.com/repos/aquasecurity/trivy/releases/latest | grep -i macos
curl -s https://api.github.com/repos/aquasecurity/trivy/releases/latest | grep -i "browser_download_url.*deb"

 \
| grep "browser_download_url.*deb" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -


az webapp log show --ids /subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourceGroups/DMZ-NonProd-Dev-AWRD-RG/providers/Microsoft.Web/sites/DMZ-NonProd-Dev-AWRD-site

az storage file delete-batch --account-key '6ni+qLKQajz+Nvd61SpBt5nTwV1sh3M/Y+2c208zLyapxN7GcdIlbX5U4UOD/kVvgaDyMhJe4EyK7I4nc8hryA==' --account-name 'dmznonproddevawrd' --pattern '*' --source 'awrdmount'

az storage logging show --account-key '6ni+qLKQajz+Nvd61SpBt5nTwV1sh3M/Y+2c208zLyapxN7GcdIlbX5U4UOD/kVvgaDyMhJe4EyK7I4nc8hryA==' --account-name 'dmznonproddevawrd' --pattern '*' --source 'awrdmount'
az storage logging show --connection-string "DefaultEndpointsProtocol=https;AccountName=dmznonproddevawrd;AccountKey=6ni+qLKQajz+Nvd61SpBt5nTwV1sh3M/Y+2c208zLyapxN7GcdIlbX5U4UOD/kVvgaDyMhJe4EyK7I4nc8hryA==;EndpointSuffix=core.windows.net"
