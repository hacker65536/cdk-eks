aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:ap-northeast-1:226870316430:cluster/Cluster9EE0221C-4bbb0cdb7be44e0281cedabf1e7de303',securityGroupIds=['sg-0000b57a240d74070'],subnetIds=['subnet-087d3067e12d558b0','subnet-074e00a26afe43c97','subnet-06e39fbbaaf8d7594']}" \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:ap-northeast-1:226870316430:workspace/ws-d9c2b944-5da5-430f-ba66-240b4da4b037'}" \
  --scrape-configuration configurationBlob="$(cat default.yml | base64)"
