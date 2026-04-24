import requests

class GithubExplorer:
    @staticmethod
    def find_projects(industry_query, stack):
        """
        Busca 5 repositorios populares en GitHub basados en la industria y el stack.
        """
        query = f"{industry_query} {stack} stars:>100"
        url = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page=5"
        
        try:
            response = requests.get(url)
            data = response.json()
            repos = []
            for item in data.get('items', []):
                repos.append({
                    "name": item['full_name'],
                    "description": item['description'],
                    "stars": item['stargazers_count'],
                    "url": item['html_url'],
                    "language": item['language']
                })
            return repos
        except Exception as e:
            print(f"Error searching Github: {e}")
            return []

# Ejemplo de uso
if __name__ == "__main__":
    explorer = GithubExplorer()
    projects = explorer.find_projects("core banking", "java")
    for p in projects:
        print(f"Found: {p['name']} ({p['stars']} stars)")
